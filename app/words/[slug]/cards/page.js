import styles from "../../page.module.css";
import { words } from "./data";

export default function Words() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>英単語帳</h1>
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