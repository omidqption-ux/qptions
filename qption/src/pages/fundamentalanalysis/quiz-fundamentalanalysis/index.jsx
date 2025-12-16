import React, { useMemo, useState, useEffect } from "react"
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'

const QUESTION_COUNT = 10

// Fisher–Yates shuffle
function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0
            ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}
function sample(arr, n) {
    return shuffle(arr).slice(0, n)
}

export default function FundamentalQuiz() {
    const { t, i18n } = useTranslation('fundamentalQuiz')
    const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

    const pool = useMemo(() => {
        const items = t('pool', { returnObjects: true }) || []
        return items
            .filter(it => it && Array.isArray(it.options) && typeof it.correctIndex === 'number')
            .map(it => ({
                q: it.q || '',
                options: it.options,
                correctIndex: Math.max(0, Math.min(it.options.length - 1, it.correctIndex)),
                explain: it.explain || '',
                source: it.source || '',
                topic: it.topic || ''
            }))
    }, [t])

    // Quiz state
    const [questions, setQuestions] = useState([])
    const [current, setCurrent] = useState(0)
    const [selected, setSelected] = useState(null)
    const [locked, setLocked] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    // Build a fresh quiz (random 10 + shuffle options)
    const buildQuiz = () => {
        const picked = sample(pool, Math.min(QUESTION_COUNT, pool.length)).map((q) => {
            const shuffled = shuffle(q.options)
            const answerIndex = shuffled.indexOf(q.options[q.correctIndex])
            return { ...q, options: shuffled, answer: answerIndex }
        })
        setQuestions(picked)
        setCurrent(0)
        setSelected(null)
        setLocked(false)
        setScore(0)
        setFinished(false)
    }

    useEffect(() => {
        if (pool.length) buildQuiz()
    }, [pool])

    if (!pool.length) {
        return (
            <main className="px-4 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-6 bg-[#0a1a2e] rounded-2xl text-blue-100 text-center">
                    {t('ui.loadingPool')}
                </div>
            </main>
        )
    }

    if (questions.length === 0) {
        return (
            <main className="px-4 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex items-center justify-center">
                <div className="w-full max-w-3xl mx-auto p-6 bg-[#0a1a2e] rounded-2xl text-blue-100 text-center">
                    {t('ui.preparing')}
                </div>
            </main>
        )
    }

    const progress = ((current + (locked ? 1 : 0)) / Math.max(1, questions.length)) * 100
    const currentQ = questions[current]

    const handleSelect = (i) => {
        if (locked) return
        setSelected(i)
    }
    const submitAnswer = () => {
        if (locked || selected === null) return
        setLocked(true)
        if (selected === currentQ.answer) setScore((s) => s + 1)
    }
    const next = () => {
        if (!locked) return
        if (current === questions.length - 1) {
            setFinished(true)
            return
        }
        setCurrent((c) => c + 1)
        setSelected(null)
        setLocked(false)
    }
    const restart = () => buildQuiz()

    return (
        <>
            <Head>
                <title>{t('seo.title')}</title>
                <meta name='description' content={t('seo.description')} />
                <meta name='keywords' content={t('seo.keywords')} />
                <meta property='og:type' content='website' />
                <meta property='og:title' content={t('seo.ogTitle')} />
                <meta property='og:description' content={t('seo.ogDesc')} />
                <meta property='og:url' content={t('seo.url')} />
                <meta property='og:image' content={t('seo.ogImage')} />
                <meta name='twitter:card' content='summary_large_image' />
                <meta name='twitter:title' content={t('seo.ogTitle')} />
                <meta name='twitter:description' content={t('seo.ogDesc')} />
                <meta name='twitter:image' content={t('seo.ogImage')} />
                <link rel='canonical' href={t('seo.url')} />
                <meta name='robots' content='index,follow' />
            </Head>

            <main dir={isRTL ? 'rtl' : 'ltr'} className='font-normal px-4 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12 '>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-12'
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-4 text-green-500'>
                        {t('ui.h1')}
                    </h1>
                    <p className="text-green-100 text-lg max-w-3xl mx-auto text-justify">
                        {t('ui.intro')}
                    </p>
                </motion.div>

                <div className="w-full max-w-3xl mx-auto p-6 bg-[#0a1a2e] rounded-2xl shadow-2xl border border-white/10">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-500">
                            {t('ui.quizTitle')}
                        </h2>
                        <p className="text-green-100/80 mt-2">
                            {t('ui.questionOf', { current: Math.min(current + 1, questions.length), total: questions.length })}
                        </p>
                        <div className="mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-[#27c789] to-[#1ba66f] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {!finished ? (
                        <>
                            {/* Question */}
                            <div className="mb-5">
                                <p className="text-blue-100 text-lg leading-relaxed">{currentQ.q}</p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3 "  >
                                {currentQ.options.map((opt, idx) => {
                                    const isCorrect = locked && idx === currentQ.answer
                                    const isSelected = idx === selected
                                    const isWrong = locked && isSelected && idx !== currentQ.answer

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(idx)}
                                            disabled={locked}
                                            className={[
                                                `${isRTL ? 'text-right' : 'text-left'}`,
                                                "w-full text-left px-4 py-3 rounded-xl border transition",
                                                "focus:outline-none focus:ring-2",
                                                locked
                                                    ? isCorrect
                                                        ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                                                        : isWrong
                                                            ? "border-rose-400/60 bg-rose-500/10 text-rose-200"
                                                            : "border-white/10 bg-white/5 text-blue-100/90"
                                                    : isSelected
                                                        ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100 ring-emerald-400/40"
                                                        : "border-white/10 bg-white/5 text-blue-100/90 hover:bg-white/10 hover:border-white/20",
                                            ].join(" ")}
                                            aria-pressed={isSelected}
                                        >
                                            <span className="font-medium">{opt}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Feedback */}
                            <div className="min-h-16 mt-4">
                                {locked ? (
                                    <div
                                        className={`rounded-xl px-4 py-3 border ${selected === currentQ.answer
                                            ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
                                            : "border-amber-400/60 bg-amber-500/10 text-amber-100"
                                            }`}
                                    >
                                        <p className="font-semibold">
                                            {selected === currentQ.answer ? t('ui.correct') : t('ui.notQuite')}
                                        </p>
                                        <p className="text-sm mt-1 text-white/80">{currentQ.explain}</p>

                                        {!!currentQ.source && (
                                            <a
                                                href={currentQ.source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-2 text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
                                            >
                                                {t('ui.learnMore')}
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-white/60 text-sm">
                                        {t('ui.selectPrompt')}
                                    </p>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="mt-6 flex items-center justify-between">
                                <button
                                    onClick={() => {
                                        if (current > 0 && !locked) setCurrent((c) => c - 1)
                                    }}
                                    disabled={current === 0 || locked}
                                    className="px-4 py-2 rounded-lg border border-white/10 text-blue-100/90 disabled:opacity-40 hover:bg-white/10 transition"
                                >
                                    {t('ui.prev')}
                                </button>

                                {!locked ? (
                                    <button
                                        onClick={submitAnswer}
                                        disabled={selected === null}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 transition disabled:opacity-40"
                                    >
                                        {t('ui.submit')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={next}
                                        className="px-5 py-2.5 rounded-xl bg-linear-to-b from-[#27c789] to-[#1ba66f] text-white font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        {current === questions.length - 1 ? t('ui.finish') : t('ui.next')}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        // Results
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-500">
                                {t('ui.scoreLabel', { score, total: questions.length })}
                            </p>
                            <p className="text-blue-100 mt-2">
                                {score >= 8
                                    ? t('ui.resultHigh')
                                    : score >= 5
                                        ? t('ui.resultMid')
                                        : t('ui.resultLow')}
                            </p>

                            <div className="mt-6 flex items-center justify-center gap-3">
                                <button
                                    onClick={restart}
                                    className="px-6 py-3 rounded-xl bg-white text-[#0a1a2e] font-semibold border border-white/10 hover:bg-white/90 transition"
                                >
                                    {t('ui.newRandom')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}


export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(
                locale,
                ['common', 'nav', 'footer', 'auth', 'fundamentalQuiz'],
                i18nConfig
            )),
        },
    }
}
