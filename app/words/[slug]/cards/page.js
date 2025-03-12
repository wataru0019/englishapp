// app/words/[slug]/cards/page.js
'use client';

import styles from "../../page.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fruitWords } from "../../1/cards/data";
import { numberWords } from "../../4/cards/data";
import { cardlist } from "../../data";
import { useRouter, useParams } from "next/navigation";

export default function Words() {
    const params = useParams();
    const [words, setWords] = useState([]);
    const [category, setCategory] = useState("");
    
    useEffect(() => {
        const slug = parseInt(params.slug);
        
        // カテゴリに応じたデータを設定
        if (slug === 1) {
            // フルーツのデータ
            setWords(fruitWords);
            setCategory(cardlist[0].card_title);
        } else if (slug === 4) {
            // 数字のデータ
            setWords(numberWords);
            setCategory(cardlist[3].card_title);
        } else {
            // 他のカテゴリ（サンプルデータを表示）
            import("./data").then(module => {
                setWords(module.words);
                
                // カテゴリタイトルを設定
                const currentCategory = cardlist.find(card => card.card_number === slug);
                if (currentCategory) {
                    setCategory(currentCategory.card_title);
                }
            }).catch(err => {
                console.error("データの読み込みに失敗しました", err);
            });
        }
    }, [params.slug]);

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>英単語帳 - {category}</h1>
                <Link href="/words" className={styles.backLink}>
                    戻る
                </Link>
            </div>
            <div className={styles.wordsArea}>
                {words.map((word) => (
                    <div key={word.id} className={styles.card}>
                        <div className={styles.cardTitle}>
                            <h3 className={styles.eitango}>{word.word}</h3>
                        </div>
                        <div className={styles.cardBody}>
                            <h3 className={styles.mean}>{word.meaning}</h3>
                            <p className={styles.exampleSentence}>{word.example}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}