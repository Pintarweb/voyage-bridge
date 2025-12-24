'use client'

import { useState } from 'react'
import { FaBug, FaLightbulb, FaHeart, FaExclamationTriangle, FaPaperPlane, FaUserTie, FaBuilding, FaSearch, FaCheck, FaTimes, FaCommentDots, FaCloud, FaChartPie, FaList, FaFire } from 'react-icons/fa'

type FeedbackType = 'bug' | 'idea' | 'praise' | 'complaint'
type UserRole = 'agent' | 'supplier'
type RoadmapStatus = 'planned' | 'in_progress' | 'completed'

interface FeedbackItem {
    id: string
    type: FeedbackType
    user: {
        name: string
        role: UserRole
        avatar?: string
    }
    content: string
    date: string
    tags: string[]
    votes?: number
}

interface RoadmapItem {
    id: string
    title: string
    description: string
    status: RoadmapStatus
    votes: number
    requestCount: number
}

const mockFeedback: FeedbackItem[] = [
    {
        id: '1',
        type: 'bug',
        user: { name: 'Odyssey Travel', role: 'agent' },
        content: 'The image upload field in the create product form freezes when I select HEIC files.',
        date: '2h ago',
        tags: ['Upload', 'Bug', 'Critical']
    },
    {
        id: '2',
        type: 'idea',
        user: { name: 'Grand Hotel', role: 'supplier' },
        content: 'It would be great to have bulk pricing updates via CSV import.',
        date: '5h ago',
        tags: ['Pricing', 'Feature Request', 'Efficiency'],
        votes: 12
    },
    {
        id: '3',
        type: 'praise',
        user: { name: 'Alice Smith', role: 'agent' },
        content: 'Loving the new dark mode! Much easier on the eyes during night shifts.',
        date: '1d ago',
        tags: ['UI/UX', 'Praise'],
    },
    {
        id: '4',
        type: 'complaint',
        user: { name: 'FastTours', role: 'supplier' },
        content: 'Verification is taking too long. I submitted my docs 3 days ago.',
        date: '1d ago',
        tags: ['Verification', 'Speed'],
    }
]

const mockRoadmap: RoadmapItem[] = [
    { id: '1', title: 'Bulk Inventory Import', description: 'Allow suppliers to upload products via CSV/Excel.', status: 'in_progress', votes: 145, requestCount: 32 },
    { id: '2', title: 'Multi-currency Support', description: 'Display prices in user local currency.', status: 'planned', votes: 89, requestCount: 15 },
    { id: '3', title: 'Direct Messaging', description: ' chat between agents and suppliers.', status: 'completed', votes: 210, requestCount: 50 },
]

export default function UserFeedbackModule() {
    const [activeTab, setActiveTab] = useState<'inbox' | 'roadmap'>('inbox')
    const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)
    const [replyText, setReplyText] = useState('')

    // 2. Sentiment Analytics Data
    const sentimentScore = 85 // Platform Happiness Score
    const topKeywords = [
        { text: 'Pricing', value: 40 },
        { text: 'Upload', value: 30 },
        { text: 'Global Agents', value: 25 },
        { text: 'Verification', value: 20 },
        { text: 'Dark Mode', value: 15 },
    ]

    const getTypeColor = (type: FeedbackType) => {
        switch (type) {
            case 'bug': return 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' // Red
            case 'idea': return 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' // Gold
            case 'praise': return 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' // Green
            case 'complaint': return 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' // Blue
        }
    }

    const getTypeIcon = (type: FeedbackType) => {
        switch (type) {
            case 'bug': return <FaBug className="text-red-500" />
            case 'idea': return <FaLightbulb className="text-amber-400" />
            case 'praise': return <FaHeart className="text-green-500" />
            case 'complaint': return <FaExclamationTriangle className="text-blue-500" />
        }
    }

    const handleQuickResponse = (template: string) => {
        setReplyText(template)
    }

    return (
        <div className="space-y-6 animate-fade-in h-full flex flex-col">

            {/* 2. Sentiment Analytics (The Overview) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Happiness Score */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FaHeart className="text-6xl text-pink-500" />
                    </div>
                    <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">Platform Happiness Score</h3>
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            {/* Simple circular gauge mock */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - sentimentScore / 100)} className="text-pink-500 transition-all duration-1000 ease-out" />
                            </svg>
                            <span className="absolute text-2xl font-bold text-white">{sentimentScore}%</span>
                        </div>
                        <div>
                            <div className="text-xs text-white/50 mb-1">Weekly Trend</div>
                            <div className="text-green-400 text-sm font-bold flex items-center gap-1">
                                <FaFire /> +5% vs last week
                            </div>
                        </div>
                    </div>
                </div>

                {/* Word Cloud (Visual Mock) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 col-span-2 relative overflow-hidden">
                    <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FaCloud className="text-cyan-400" /> Trending Topics
                    </h3>
                    <div className="flex flex-wrap gap-4 items-center justify-center h-full pb-6">
                        {topKeywords.map((kw, i) => (
                            <span
                                key={i}
                                style={{ fontSize: `${1 + kw.value / 20}rem`, opacity: 0.5 + kw.value / 100 }}
                                className="font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer"
                            >
                                {kw.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('inbox')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'inbox' ? 'border-cyan-500 text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                >
                    <FaCommentDots /> Feedback Inbox
                </button>
                <button
                    onClick={() => setActiveTab('roadmap')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'roadmap' ? 'border-amber-500 text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                >
                    <FaList /> Feature Roadmap
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                {/* 1. Feedback Inbox (The Stream) */}
                {activeTab === 'inbox' && (
                    <div className="h-full overflow-y-auto pr-2 space-y-4 pb-20">
                        {mockFeedback.map((item) => (
                            <div key={item.id} className={`bg-white/5 border border-white/5 rounded-xl p-4 transition-all hover:bg-white/10 ${getTypeColor(item.type)} border-l-4`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.user.role === 'agent' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {item.user.role === 'agent' ? <FaUserTie /> : <FaBuilding />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{item.user.name}</div>
                                            <div className="text-[10px] text-white/40 uppercase tracking-widest">{item.user.role}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-white/30">{item.date}</div>
                                </div>

                                <div className="pl-11">
                                    <p className="text-white/90 text-sm mb-3">
                                        <span className="mr-2 inline-block transform translate-y-0.5">{getTypeIcon(item.type)}</span>
                                        {item.content}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/60 border border-white/10">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* 4. Quick Response Console */}
                                    <div className="bg-black/30 rounded-lg p-3 border border-white/5 backdrop-blur-sm">
                                        <div className="text-[10px] text-white/40 uppercase font-bold mb-2 flex items-center gap-2">
                                            <FaPaperPlane className="text-cyan-400" /> Quick Response
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <button onClick={() => handleQuickResponse("Thank you, Pioneer! We've added this to our build list.")} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-cyan-300 transition-colors">
                                                Template: Added to List
                                            </button>
                                            <button onClick={() => handleQuickResponse("Sorry for the friction—here is the fix.")} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-cyan-300 transition-colors">
                                                Template: Friction Fix
                                            </button>
                                            <button onClick={() => handleQuickResponse("Thanks for the love! We appreciate it.")} className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-cyan-300 transition-colors">
                                                Template: Praise
                                            </button>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Type your response..."
                                                className="flex-1 bg-transparent border-b border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500 px-2 py-1"
                                                defaultValue={replyText}
                                            />
                                            <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded text-xs font-bold transition-all">
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. Feature Roadmap Builder */}
                {activeTab === 'roadmap' && (
                    <div className="h-full overflow-y-auto">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-black/20 border-b border-white/10 text-xs uppercase tracking-wider text-white/50 font-semibold">
                                        <th className="py-4 px-4">Feature Request</th>
                                        <th className="py-4 px-4 text-center">Upvotes</th>
                                        <th className="py-4 px-4">Status</th>
                                        <th className="py-4 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockRoadmap.sort((a, b) => b.votes - a.votes).map((feature) => (
                                        <tr key={feature.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-white text-sm">{feature.title}</div>
                                                <div className="text-xs text-white/50">{feature.description}</div>
                                                <div className="mt-1 text-[10px] text-cyan-400">{feature.requestCount} users requested this</div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="inline-flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                                                    <FaFire className="text-amber-500 text-xs" />
                                                    <span className="text-white font-bold text-sm">{feature.votes}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <select
                                                    className={`bg-transparent border border-white/10 rounded px-2 py-1 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer
                                                        ${feature.status === 'completed' ? 'text-green-400 border-green-500/30' :
                                                            feature.status === 'in_progress' ? 'text-amber-400 border-amber-500/30' :
                                                                'text-blue-400 border-blue-500/30'}`}
                                                    defaultValue={feature.status}
                                                >
                                                    <option value="planned" className="bg-[#1A1A20] text-blue-400">Planned</option>
                                                    <option value="in_progress" className="bg-[#1A1A20] text-amber-400">In Progress</option>
                                                    <option value="completed" className="bg-[#1A1A20] text-green-400">Completed</option>
                                                </select>
                                                <div className="text-[9px] text-white/30 mt-1">Updates notify voters</div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
