'use client'

import Link from 'next/link'
import { Card } from '@/types'

interface Props {
  card: Card
}

const sourceIcon: Record<string, string> = {
  youtube: '📺',
  image: '📸',
  text: '📝',
  url: '🔗',
}

const visibilityLabel: Record<string, string> = {
  public: '🌐',
  link: '🔗',
  private: '🔒',
}

export default function CardItem({ card }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {card.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <span className="text-sm">{visibilityLabel[card.visibility]}</span>
      </div>

      <h2 className="font-bold text-base leading-snug">
        {sourceIcon[card.source_type]} {card.ai_title}
      </h2>

      <ul className="space-y-1">
        {card.ai_points.map((point, i) => (
          <li key={i} className="text-sm text-gray-700 flex gap-2">
            <span className="text-gray-400 shrink-0">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {new Date(card.created_at).toLocaleDateString('ko-KR')}
        </span>
        <div className="flex gap-3 items-center">
          {card.source_url && (
            
              <a href={card.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-black underline"
            >
              자세히 보기 →
            </a>
          )}
          <Link
            href={`/c/${card.slug}`}
            className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800"
          >
            공유
          </Link>
        </div>
      </div>
    </div>
  )
}