const pics = ["hotel.jpg", "hotel2.jpg", "hotel3.jpg", "hotel4.jpg", "hotel5.jpg", "hotel6.jpg", "hotel7.jpg"];

export default function shuffleArray() {
    let i;
    let j;
    let temp;
    for (i = pics.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = pics[i];
        pics[i] = pics[j];
        pics[j] = temp;
    }
    return pics[0];
}


