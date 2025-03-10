import styles from "./page.module.css";
import { cardlist } from "./data";
import Link from 'next/link';

export default function Words() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h1>英単語帳</h1>
            </div>
            <div className={styles.wordsArea}>
                {cardlist.map((card) => (
                    <Link href={`/words/${card.card_number}/cards`} key={card.card_number}>
                        <div className={styles.card}>
                            <div className={styles.cardTitle}>
                                <h3 className={styles.eitango}>{card.card_title}</h3>
                            </div>
                            <div className={styles.cardBody}>
                                <p className={styles.cardDescription}>{card.card_description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}