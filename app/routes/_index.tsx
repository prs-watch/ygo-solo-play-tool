import type { MetaFunction } from '@remix-run/node'

import React, { useState, useCallback, useRef } from 'react'
import { Plus, Trash2, Upload, RotateCcw, Save } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import domtoimage from 'dom-to-image'
import { v4 as uuidv4 } from 'uuid'

/**
 * Remix app が `<Meta />` でロードするメタ情報.
 *
 * @returns - メタファンクション
 */
export const meta: MetaFunction = () => {
  return [
    { title: 'YGO Solo-Play Tool' },
    { name: 'description', content: 'Tool to play YGO for solo.' }
  ]
}

/**
 * 盤面型.
 */
type Zone = 'hand' | 'field' | 'graveyard' | 'banished'

/**
 * ゲームStep型. 各Stepの盤面状態を保持する.
 *
 * @property id - Stepに振り出されるアプリで一意なid
 * @property hand - 手札に配置されるカード画像URLリスト
 * @property field - フィールドに配置されるカード画像URLリスト
 * @property graveyard - 墓地に配置されるカード画像URLリスト
 * @property banished - 除外ゾーンに配置されるカード画像URLリスト
 */
type GameState = {
  id: number
  hand: string[]
  field: string[]
  graveyard: string[]
  banished: string[]
}

/**
 * `host/` にアクセスした時のアプリケーション定義.
 *
 * @returns - アプリケーション定義
 */
export default function Index() {
  // 盤面推移
  const [gameStates, setGameStates] = useState<GameState[]>([])
  // Stepに付与する一意なid
  const [nextId, setNextId] = useState(1)
  // スクロールエリアへの参照
  const scrollable = useRef<HTMLDivElement>(null)

  /**
   * Stepを追加した際に自動で一番右までスクロールする.
   */
  const scrollToRight = () => {
    if (scrollable.current) {
      scrollable.current.scrollTo({
        left: scrollable.current.scrollWidth,
        behavior: 'smooth',
      })
    }
  }

  /**
   * 新規Stepを追加する.
   */
  const addGameState = () => {
    const newState: GameState = {
      id: nextId,
      hand: [],
      field: [],
      graveyard: [],
      banished: [],
    }
    setGameStates([...gameStates, newState])
    setNextId(nextId + 1)
  }

  /**
   * 既存のStepを削除する.
   *
   * @param id - Stepに付与されるid
   */
  const removeGameState = (id: number) => {
    setGameStates(gameStates.filter((state) => state.id !== id))
  }

  /**
   * DaDのうちドロップ時の挙動. 画像が表示だけされる様にする.
   * 同一の画像をアップロードした場合は以前の結果を流用出来る様にuseCallbackを使用.
   */
  const handleDrop = useCallback(
    (stateId: number, zone: Zone, files: FileList | null) => {
      if (files) {
        const newImages = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        )
        setGameStates((prevStates) =>
          prevStates.map((state) =>
            state.id === stateId
              ? { ...state, [zone]: [...state[zone], ...newImages] }
              : state
          )
        )
      }
    },
    []
  )

  /**
   * DaDのうちドラッグしたまま枠外へ出た場合の処理. 後続処理を止める.
   *
   * @param e - ドラッグイベント
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  /**
   * 表示している画像を削除する.
   *
   * @param stateId - Stepに一意に付与されるid
   * @param zone - 対象ゾーン
   * @param index - カード順序
   */
  const removeImage = (stateId: number, zone: Zone, index: number) => {
    setGameStates((prevStates) =>
      prevStates.map((state) =>
        state.id === stateId
          ? { ...state, [zone]: state[zone].filter((_, i) => i !== index) }
          : state
      )
    )
  }

  /**
   * Resetボタン押下時の処理. 初期表示同様に空Stepを1個だけ配置.
   */
  const handleReset = () => {
    setGameStates([
      {
        id: nextId,
        hand: [],
        field: [],
        graveyard: [],
        banished: [],
      },
    ])
    setNextId(nextId + 1)
  }

  /**
   * Saveボタン押下時の処理.　gameStatesの内容をpng形式でダウンロードする.
   */
  const handleSave = async () => {
    const a = document.createElement('a')
    a.href = await domtoimage.toPng(scrollable.current as Node, {
      // Stepの幅 + marginを必要幅として計算
      width: (370 + 16) * gameStates.length,
      height: scrollable.current?.clientHeight,
    })
    a.download = `yspt-${uuidv4()}.png`
    a.click()
  }

  /**
   * Stepの中に表示するゾーンエリアのレンダリング.
   *
   * @param state - 対象のStep
   * @param zone - レンダリングするZone
   * @returns - ゾーンエリア
   */
  const renderZone = (state: GameState, zone: Zone) => {
    return (
      <div className='mb-2'>
        <h3 className='text-sm font-semibold mb-1 capitalize'>{zone}</h3>
        <div
          className='border-2 border-dashed border-gray-300 rounded-lg p-2 min-h-[80px] h-24 overflow-y-auto'
          onDrop={(e) => {
            e.preventDefault()
            handleDrop(state.id, zone, e.dataTransfer.files)
          }}
          onDragOver={handleDragOver}
        >
          {state[zone].length === 0 ? (
            <div className='flex items-center justify-center h-full text-gray-400 text-xs'>
              <Upload className='mr-1 h-3 w-3' />
              <span>Drop Image</span>
            </div>
          ) : (
            <div className='flex flex-wrap gap-1'>
              {state[zone].map((img, index) => (
                <div key={index} className='relative group w-12 h-18'>
                  <img
                    src={img}
                    className='w-full h-full object-cover rounded'
                  />
                  <button
                    className='absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={() => removeImage(state.id, zone, index)}
                  >
                    <Trash2 className='h-2 w-2' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  React.useEffect(() => {
    addGameState()
  }, [])

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>YGO Solo-Play Tool</h1>
      </div>
      <div className='items-center'>
        <Button className='m-2' variant='outline' onClick={handleSave}>
          <Save className='mr-2 h-4 w-4' />
          Save
        </Button>
        <Button className='m-2' variant='outline' onClick={handleReset}>
          <RotateCcw className='mr-2 h-4 w-4' />
          Reset
        </Button>
      </div>
      <div
        ref={scrollable}
        className='overflow-x-auto whitespace-nowrap w-full'
      >
        <div className='flex space-x-4 p-4'>
          {gameStates.map((state, index) => (
            <Card key={state.id} className='w-[370px] flex-shrink-0'>
              <CardHeader className='p-3'>
                <CardTitle className='flex justify-between items-center text-sm'>
                  <span>Step #{index + 1}</span>
                  <Button
                    variant='destructive'
                    size='icon'
                    className='h-6 w-6'
                    onClick={() => removeGameState(state.id)}
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3 pt-0'>
                {renderZone(state, 'hand')}
                {renderZone(state, 'field')}
                {renderZone(state, 'graveyard')}
                {renderZone(state, 'banished')}
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={() => {
              addGameState()
              setTimeout(scrollToRight, 0)
            }}
          >
            <Plus className='m-2 h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
