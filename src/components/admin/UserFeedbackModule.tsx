'use client'

import { useState, useEffect } from 'react'

import { FaBug, FaLightbulb, FaHeart, FaExclamationTriangle, FaPaperPlane, FaUserTie, FaBuilding, FaSearch, FaCheck, FaTimes, FaCommentDots, FaCloud, FaChartPie, FaList, FaFire, FaReply, FaCog, FaTrash, FaPlus, FaChevronDown } from 'react-icons/fa'
import { getFeedbackStats, submitFeedbackResponse, getRoadmapItems, getResponseTemplates, addResponseTemplate, deleteResponseTemplate, type RoadmapItem, type ResponseTemplate } from '@/app/actions/feedback'




type FeedbackType = 'bug' | 'idea' | 'praise' | 'complaint'
type UserRole = 'agent' | 'supplier'

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
    response?: string | null
}

export default function UserFeedbackModule() {
    const [activeTab, setActiveTab] = useState<'inbox' | 'roadmap'>('inbox')
    const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)

    const [replyText, setReplyText] = useState('')
    const [openReplyId, setOpenReplyId] = useState<string | null>(null)
    const [inboxFilter, setInboxFilter] = useState<'pending' | 'replied'>('pending')
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

    // Roadmap State
    const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([])
    const [loadingRoadmap, setLoadingRoadmap] = useState(false)

    // Templates State
    const [templates, setTemplates] = useState<ResponseTemplate[]>([])
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [newTemplate, setNewTemplate] = useState({ label: '', content: '' })

    // Stats State
    const [stats, setStats] = useState({
        happinessScore: 0,
        reviews: [] as FeedbackItem[],
        loading: true,
        trend: 0
    })

    const submitResponse = async () => {
        if (!replyText.trim() || !openReplyId) return

        try {
            const res = await submitFeedbackResponse(openReplyId, replyText)
            if (res.success) {
                // Success feedback (could use toast here)
                console.log('Response submitted!')
                setOpenReplyId(null)
                setReplyText('')
                setOpenReplyId(null)
                setReplyText('')

                // Optimistically update local state to move to 'replied'
                setStats(prev => ({
                    ...prev,
                    reviews: prev.reviews.map(r => r.id === openReplyId ? { ...r, response: replyText } : r)
                }))
            } else {
                console.error('Failed to submit response:', res.error)
            }
        } catch (error) {
            console.error('Error submitting response:', error)
        }
    }

    // Load Roadmap on tab change
    useEffect(() => {
        if (activeTab === 'roadmap' && roadmapItems.length === 0) {
            const fetchRoadmap = async () => {
                setLoadingRoadmap(true)
                try {
                    const items = await getRoadmapItems()
                    setRoadmapItems(items)
                } catch (error) {
                    console.error("Failed to load roadmap", error)
                } finally {
                    setLoadingRoadmap(false)
                }
            }
            fetchRoadmap()
        }
    }, [activeTab])

    useEffect(() => {
        const loadData = async () => {
            // ... (existing loadData)
            try {
                const data = await getFeedbackStats()
                setStats({
                    happinessScore: data.happinessScore,
                    reviews: data.reviews,
                    loading: false,
                    trend: data.trend || 0
                })
            } catch (err) {
                console.error("Failed to load feedback stats", err)
                setStats(prev => ({ ...prev, loading: false }))
            }
        }
        loadData()
        loadData()
    }, [])

    useEffect(() => {
        loadTemplates()
    }, [])

    const loadTemplates = async () => {
        const data = await getResponseTemplates()
        setTemplates(data)
    }

    const handleAddTemplate = async () => {
        if (!newTemplate.label || !newTemplate.content) return
        const res = await addResponseTemplate(newTemplate.label, newTemplate.content)
        if (res.success) {
            setNewTemplate({ label: '', content: '' })
            loadTemplates()
        }
    }

    const handleDeleteTemplate = async (id: string) => {
        if (confirm('Delete this template?')) {
            await deleteResponseTemplate(id)
            loadTemplates()
        }
    }

    // ... (rest of component) ...

    // Replace mockRoadmap in render with roadmapItems


    // 2. Sentiment Analytics Data
    const sentimentScore = stats.happinessScore // Platform Happiness Score
    // Mock keywords for now until we implement real keyword extraction
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
        <div className="space-y-6 animate-fade-in h-full flex flex-col relative">

            {/* Template Management Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0f111a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <FaCog className="text-cyan-400" /> Manage Templates
                            </h3>
                            <button onClick={() => setShowTemplateModal(false)} className="text-white/40 hover:text-white">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <label className="text-xs text-white/40 font-bold uppercase">New Template Label</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    placeholder="e.g. 'Investigating'"
                                    value={newTemplate.label}
                                    onChange={e => setNewTemplate({ ...newTemplate, label: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-white/40 font-bold uppercase">Response Content</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none h-20 resize-none"
                                    placeholder="The actual message..."
                                    value={newTemplate.content}
                                    onChange={e => setNewTemplate({ ...newTemplate, content: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleAddTemplate}
                                disabled={!newTemplate.label || !newTemplate.content}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
                            >
                                <FaPlus /> Add Template
                            </button>
                        </div>

                        <div className="border-t border-white/10 pt-4 max-h-60 overflow-y-auto">
                            <h4 className="text-xs text-white/40 font-bold uppercase mb-3">Existing Templates</h4>
                            <div className="space-y-2">
                                {templates.map(t => (
                                    <div key={t.id} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5 group">
                                        <div>
                                            <div className="text-white font-bold text-sm">{t.label}</div>
                                            <div className="text-white/50 text-xs truncate max-w-[200px]">{t.content}</div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTemplate(t.id)}
                                            className="text-white/20 hover:text-red-400 transition-colors p-2"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                                {templates.length === 0 && <div className="text-white/20 text-center text-sm italic py-4">No templates yet.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            <div className={`${stats.trend >= 0 ? 'text-green-400' : 'text-red-400'} text-sm font-bold flex items-center gap-1`}>
                                <FaFire className={stats.trend >= 0 ? 'text-green-500' : 'text-red-500'} />
                                {stats.trend > 0 ? '+' : ''}{stats.trend}% vs last week
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
                    <div className="h-full overflow-y-auto pr-2 pb-20">
                        {/* Sub-tabs for Inbox */}
                        <div className="flex gap-4 mb-4 px-1 sticky top-0 bg-[#0f111a] z-10 py-2">
                            <button
                                onClick={() => setInboxFilter('pending')}
                                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${inboxFilter === 'pending' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                            >
                                Pending ({stats.reviews.filter(r => !r.response).length})
                            </button>
                            <button
                                onClick={() => setInboxFilter('replied')}
                                className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${inboxFilter === 'replied' ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
                            >
                                Replied ({stats.reviews.filter(r => r.response).length})
                            </button>
                        </div>

                        <div className="space-y-4">
                            {stats.loading ? (
                                <div className="text-white/40 text-center py-10">Loading feedback...</div>
                            ) : stats.reviews.filter(r => inboxFilter === 'pending' ? !r.response : r.response).length === 0 ? (
                                <div className="text-white/40 text-center py-10 flex flex-col items-center gap-2">
                                    <FaCheck className="text-green-500/50 text-4xl mb-2" />
                                    <div>No {inboxFilter} feedback.</div>
                                </div>
                            ) : (
                                stats.reviews.filter(r => inboxFilter === 'pending' ? !r.response : r.response).map((item) => (
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
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="text-xs text-white/30">{item.date}</div>
                                                {!item.response && (
                                                    <button
                                                        onClick={() => setOpenReplyId(openReplyId === item.id ? null : item.id)}
                                                        className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider bg-white/5 px-2 py-1 rounded border border-white/10"
                                                    >
                                                        <FaReply /> Reply
                                                    </button>
                                                )}
                                            </div>
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



                                            {/* Display Existing Response */}
                                            {item.response && (
                                                <div className="mt-4 ml-6 p-3 bg-white/5 border-l-2 border-green-500 rounded-r-lg">
                                                    <div className="text-[10px] text-green-400 font-bold uppercase mb-1 flex items-center gap-1">
                                                        <FaReply /> You Replied
                                                    </div>
                                                    <p className="text-white/80 text-xs italic">"{item.response}"</p>
                                                </div>
                                            )}

                                            {/* Quick Response Console (Collapsible) - Only if not replied */}
                                            {openReplyId === item.id && !item.response && (
                                                <div className="bg-black/30 rounded-lg p-3 border border-white/5 backdrop-blur-sm mt-3 animate-fade-in">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="text-[10px] text-white/40 uppercase font-bold flex items-center gap-2">
                                                            <FaPaperPlane className="text-cyan-400" /> Quick Response
                                                        </div>
                                                        <button
                                                            onClick={() => setShowTemplateModal(true)}
                                                            className="text-[10px] text-white/30 hover:text-white flex items-center gap-1 transition-colors"
                                                        >
                                                            <FaCog /> Manage
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {templates.map(t => (
                                                            <button
                                                                key={t.id}
                                                                onClick={() => handleQuickResponse(t.content)}
                                                                className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/30"
                                                                title={t.content}
                                                            >
                                                                {t.label}
                                                            </button>
                                                        ))}
                                                        {templates.length === 0 && <span className="text-[10px] text-white/20 italic">No templates found</span>}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Type your response..."
                                                            className="flex-1 bg-transparent border-b border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500 px-2 py-1"
                                                            defaultValue={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                        />
                                                        <button
                                                            onClick={submitResponse}
                                                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded text-xs font-bold transition-all"
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                                    {roadmapItems.sort((a, b) => b.votes - a.votes).map((feature) => (
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
                                                <div className="relative inline-block w-full max-w-[200px]">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setOpenDropdownId(openDropdownId === feature.id ? null : feature.id)
                                                        }}
                                                        className={`w-full flex items-center justify-between border rounded pl-3 pr-2 py-1.5 text-xs font-bold uppercase tracking-wider transition-all
                                                            ${feature.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' :
                                                                feature.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30' :
                                                                    feature.status === 'planned' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' :
                                                                        'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                                                    >
                                                        <span className="whitespace-nowrap">
                                                            {feature.status === 'in_progress' ? 'In Progress' :
                                                                feature.status === 'planned' ? 'Planned' :
                                                                    feature.status === 'completed' ? 'Released' :
                                                                        'Proposed'}
                                                        </span>
                                                        <FaChevronDown className="text-[10px] opacity-70" />
                                                    </button>

                                                    {openDropdownId === feature.id && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f111a] border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col p-1 gap-1">
                                                            {['proposed', 'planned', 'in_progress', 'completed'].map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        // Optimistically update status
                                                                        setRoadmapItems(items => items.map(i => i.id === feature.id ? { ...i, status: status as any } : i))
                                                                        setOpenDropdownId(null)
                                                                    }}
                                                                    className={`px-3 py-2 text-left text-xs font-bold uppercase rounded transition-colors
                                                                        ${status === 'completed' ? 'text-green-400 hover:bg-green-500/20' :
                                                                            status === 'in_progress' ? 'text-amber-400 hover:bg-amber-500/20' :
                                                                                status === 'planned' ? 'text-blue-400 hover:bg-blue-500/20' :
                                                                                    'text-gray-400 hover:bg-white/10'}`}
                                                                >
                                                                    {status === 'in_progress' ? 'In Progress' :
                                                                        status === 'planned' ? 'Planned' :
                                                                            status === 'completed' ? 'Released' :
                                                                                'Proposed'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
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
