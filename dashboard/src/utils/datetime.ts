const pyDateToJsDate = ( pyDate?: string ): Date | null => {
    if (!pyDate) return null;

    const cleaned = pyDate.replace('T', ' ').split('.')[0];

    const [date, time] = cleaned.split(' ');
    if (!date || !time) return null;

    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes, seconds] = time.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
};


const getDateString = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',   
        day: '2-digit',
    };
    return date.toLocaleDateString('en-GB', options);
}


const getTimeString = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    return date.toLocaleTimeString('en-GB', options);
}


const getFormattedTimeString = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}   


export { pyDateToJsDate, getDateString, getTimeString, getFormattedTimeString };