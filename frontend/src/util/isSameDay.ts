export const isSameDay = (day1: Date, day2: Date): boolean => {
    return day1.getDate() == day2.getDate() && day1.getMonth() == day2.getMonth() && day1.getFullYear() == day2.getFullYear();
}
