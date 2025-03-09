import styles from "./page.module.css";

export default function Words() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>英単語帳</h1>
            </div>
            <div className={styles.wordsArea}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <h3 className={styles.eitango}>Apple</h3>
                    </div>
                    <div className={styles.cardBody}>
                        <h3 className={styles.mean}>りんご</h3>
                        <h3 className={styles.exampleSentence}>I eat apple.</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}