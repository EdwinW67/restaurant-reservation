export function randomDateWithin30Days(): string {
    const today = new Date();
    const daysToAdd = Math.floor(Math.random() * 30) + 1; // between 1–30
    const result = new Date(today);
    result.setDate(today.getDate() + daysToAdd);

    // return yyyy-mm-dd (Playwright <input type="date"> format)
    return result.toISOString().split('T')[0];
}
