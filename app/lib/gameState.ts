import { useState } from 'react'

/**
 * 盤面型.
 */
export const Zone = {
  Hand: 'hand',
  Field: 'field',
  Graveyard: 'graveyard',
  Banished: 'banished',
  Extra: 'extra',
} as const
export type ZoneType = typeof Zone[keyof typeof Zone]

/**
 * ゲームStep型. 各Stepの盤面状態を保持する.
 *
 * @property id - Stepに振り出されるアプリで一意なid
 * @property hand - 手札に配置されるカード画像URLリスト
 * @property field - フィールドに配置されるカード画像URLリスト
 * @property graveyard - 墓地に配置されるカード画像URLリスト
 * @property banished - 除外ゾーンに配置されるカード画像URLリスト
 * @property extra - エクストラデッキに配置されるカード画像URLリスト
 */
export type GameState = {
  id: number
  [Zone.Hand]: string[]
  [Zone.Field]: string[]
  [Zone.Graveyard]: string[]
  [Zone.Banished]: string[]
  [Zone.Extra]: string[]
}

/**
 * 盤面を制御するcustom hook.
 */
export const useGameStates = () => {
  // 盤面推移
  const [gameStates, setGameStates] = useState<GameState[]>([])
  // Stepに付与する一意なid
  const [nextId, setNextId] = useState(1)

  /**
   * 新規Stepを追加する. 既存Stepへの追加の場合は前回盤面をコピーする.
   * 
   * @param index - 直前Stepのindex
   */
  const addGameState = (prevIndex: number | undefined = undefined) => {
    const newState: GameState =
      prevIndex === undefined
        ? {
            id: nextId,
            hand: [],
            field: [],
            graveyard: [],
            banished: [],
            extra: [],
          }
        : {
            ...gameStates[prevIndex],
            id: nextId,
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

  return { gameStates, nextId, addGameState, removeGameState, setGameStates, setNextId }
}
