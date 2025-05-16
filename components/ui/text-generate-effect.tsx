"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export const TextGenerateEffect = ({ words }: { words: string }) => {
  const [wordArray, setWordArray] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setWordArray(words.split(" "))
  }, [words])

  useEffect(() => {
    if (currentIndex < wordArray.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, 80)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, wordArray])

  return (
    <div className="font-bold">
      {wordArray.map((word, idx) => {
        return (
          <motion.span
            key={idx}
            className={`inline-block ${idx !== 0 ? "ml-[0.2em]" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={idx <= currentIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              delay: idx * 0.08,
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            {word}
          </motion.span>
        )
      })}
      {isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="inline-block ml-1"
        >
          <span className="text-red-500">.</span>
        </motion.span>
      )}
    </div>
  )
}
