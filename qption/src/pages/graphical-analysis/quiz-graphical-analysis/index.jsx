'use client'
import React, { useMemo, useState, useEffect } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import i18nConfig from '../../../../next-i18next.config.cjs'
import SEOAlternates from '@/components/SEOAlternates'

const QUESTION_COUNT = 10

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

export default function TechnicalQuizPage() {
    const { t: tq, i18n } = useTranslation('graphicalQuiz')
    const isRTL = ['fa', 'ar', 'ur', 'he'].includes(i18n.language)

    // Pull question pool from translations
    const pool = useMemo(() => {
        const p = tq('pool', { returnObjects: true })
        return Array.isArray(p) ? p : []
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language])

    const [questions, setQuestions] = useState([])
    const [current, setCurrent] = useState(0)
    const [selected, setSelected] = useState(null)
    const [locked, setLocked] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    // Build a fresh quiz (random 10 + shuffled options)
    const buildQuiz = () => {
        const picked = sample(pool, QUESTION_COUNT).map((q) => {
            const shuffledOptions = shuffle(q.options)
            const answerIndex = shuffledOptions.indexOf(q.correct)
            return { ...q, options: shuffledOptions, answer: answerIndex }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pool])

    const progress =
        ((current + (locked ? 1 : 0)) / Math.max(1, questions.length)) * 100

    const handleSelect = (idx) => {
        if (locked) return
        setSelected(idx)
    }

    const submitAnswer = () => {
        if (locked || selected === null) return
        setLocked(true)
        if (selected === questions[current].answer) setScore((s) => s + 1)
    }

    const next = () => {
        if (!locked) return
        const last = current === questions.length - 1
        if (last) {
            setFinished(true)
            return
        }
        setCurrent((c) => c + 1)
        setSelected(null)
        setLocked(false)
    }

    const restart = () => buildQuiz()

    // Loading states
    if (!pool.length) {
        return (
            <>
                <Head>
                    <title>{tq('seo.title')}</title>
                    <meta name="description" content={tq('seo.description')} />
                </Head>
                <SEOAlternates />
                <main
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="bg-linear-to-b from-[#142B47] to-[#142B47]/90 w-full flex items-center justify-center p-6 min-h-screen"
                >
                    <div className="w-full max-w-3xl p-6 bg-[#0a1a2e] rounded-2xl text-blue-100">
                        {tq('ui.loading')}
                    </div>
                </main>
            </>
        )
    }

    const currentQ = questions[current]

    return (
        <>
            <Head>
                {/* SEO */}
                <title>{tq('seo.title')}</title>
                <meta name="description" content={tq('seo.description')} />
                <meta name="keywords" content={tq('seo.keywords')} />

                {/* OG/Twitter */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={tq('seo.ogTitle')} />
                <meta property="og:description" content={tq('seo.ogDescription')} />
                <meta property="og:url" content={tq('seo.url')} />
                <meta property="og:image" content={tq('seo.image')} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={tq('seo.twitterSite')} />
                <meta name="twitter:title" content={tq('seo.twitterTitle')} />
                <meta name="twitter:description" content={tq('seo.twitterDescription')} />
                <meta name="twitter:image" content={tq('seo.twitterImage')} />
                <link rel="canonical" href={tq('seo.canonical')} />
                <meta name="robots" content="index,follow" />
            </Head>

            <SEOAlternates />

            <main
                dir={isRTL ? 'rtl' : 'ltr'}
                className="px-2 min-h-screen bg-linear-to-br from-[#142B47] to-[#142B47]/90 w-full flex flex-col items-center justify-start py-12"
            >
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-500">
                        {tq('page.title')}
                    </h1>
                    <p
                        className={`text-green-100 text-lg max-w-3xl mx-auto ${isRTL ? 'text-right' : 'text-justify'
                            }`}
                    >
                        {tq('page.subtitle')}
                    </p>
                </motion.div>

                {/* Quiz Card */}
                <div className="w-full max-w-3xl mx-auto p-6 bg-[#0a1a2e] rounded-2xl shadow-2xl border border-white/10">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-green-500">
                            {tq('quiz.header')}
                        </h2>
                        <p className="text-green-100/80 mt-2">
                            {tq('quiz.progress', {
                                current: Math.min(current + 1, questions.length),
                                total: questions.length,
                            })}
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
                                <p className="text-blue-100 text-lg leading-relaxed">
                                    {currentQ?.q}
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {currentQ?.options?.map((opt, idx) => {
                                    const isCorrect = locked && idx === currentQ.answer
                                    const isSelected = idx === selected
                                    const isWrong = locked && isSelected && idx !== currentQ.answer

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(idx)}
                                            disabled={locked}
                                            className={[
                                                `${isRTL ? 'text-start' : 'text-end'}`,
                                                'w-full text-left px-4 py-3 rounded-xl border transition',
                                                'focus:outline-none focus:ring-2',
                                                locked
                                                    ? isCorrect
                                                        ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                                                        : isWrong
                                                            ? 'border-rose-400/60 bg-rose-500/10 text-rose-200'
                                                            : 'border-white/10 bg-white/5 text-blue-100/90'
                                                    : isSelected
                                                        ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100 ring-emerald-400/40'
                                                        : 'border-white/10 bg-white/5 text-blue-100/90 hover:bg-white/10 hover:border-white/20',
                                            ].join(' ')}
                                            aria-pressed={isSelected}
                                        >
                                            <span className="font-medium">{opt}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Feedback */}
                            <div className="min-h-14 mt-4">
                                {locked ? (
                                    <div
                                        className={`rounded-xl px-4 py-3 border ${selected === currentQ.answer
                                            ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100'
                                            : 'border-amber-400/60 bg-amber-500/10 text-amber-100'
                                            }`}
                                    >
                                        <p className="font-semibold">
                                            {selected === currentQ.answer
                                                ? tq('quiz.correct')
                                                : tq('quiz.incorrect')}
                                        </p>
                                        <p className="text-sm mt-1 text-white/80">
                                            {currentQ.explain}
                                        </p>

                                        {/* Learn more link */}
                                        {currentQ.source && (
                                            <a
                                                href={currentQ.source}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-2 text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
                                            >
                                                {tq('quiz.learnMore')}
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-white/60 text-sm">{tq('quiz.selectHint')}</p>
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
                                    {tq('ui.previous')}
                                </button>

                                {!locked ? (
                                    <button
                                        onClick={submitAnswer}
                                        disabled={selected === null}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 transition disabled:opacity-40"
                                    >
                                        {tq('ui.submit')}
                                    </button>
                                ) : (
                                    <button
                                        onClick={next}
                                        className="px-5 py-2.5 rounded-xl bg-linear-to-b from-[#27c789] to-[#1ba66f] text-white font-semibold shadow-lg hover:shadow-xl transition"
                                    >
                                        {current === questions.length - 1 ? tq('ui.finish') : tq('ui.next')}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        // Results
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-500">
                                {tq('results.score', { score, total: questions.length })}
                            </p>
                            <p className="text-blue-100 mt-2">
                                {score >= 8
                                    ? tq('results.tier.excellent')
                                    : score >= 5
                                        ? tq('results.tier.good')
                                        : tq('results.tier.retry')}
                            </p>

                            <div className="mt-6 flex items-center justify-center gap-3">
                                <button
                                    onClick={restart}
                                    className="px-6 py-3 rounded-xl bg-white text-[#0a1a2e] font-semibold border border-white/10 hover:bg-white/90 transition"
                                >
                                    {tq('ui.newRandom')}
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
                ['common', 'nav', 'footer', 'auth', 'graphicalQuiz'],
                i18nConfig
            )),
        },
    }
}
