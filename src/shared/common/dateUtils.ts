const DAY_MILISECONDS = 86400000;
const HOURSE_MILISECONDS = 3600000;
const MINUTE_MILISECONDS = 60000;

export class DateUtils {
  public static toObject(date: Date) {
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  }

  public static toDate(dateString: string): Date {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (date.toDateString() === 'Invalid Date') return null;

    return date;
  }

  public static toDateFromObject(dateObj): Date {
    const { day, month, year } = dateObj;
    const dateString = `${year}-${month}-${day}`;
    return this.toDate(dateString);
  }

  public static toObjectFull(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    };
  }

  public static toTime(date: Date) {
    const nowTempt = new Date();

    //  tính năm
    if (nowTempt.getFullYear() - date.getFullYear() > 0)
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const dateWasMinus7day = nowTempt.setDate(nowTempt.getDate() - 7);

    if (date < new Date(dateWasMinus7day))
      return `${date.getDate()}/${date.getMonth() + 1}`;

    const now = new Date();
    const numberMiliseconds = now.valueOf() - date.valueOf();

    // tính ngày
    const day = Math.floor(numberMiliseconds / DAY_MILISECONDS);
    if (day > 0) return `${day} ngày`;

    // tính giờ
    const hour = Math.floor(numberMiliseconds / HOURSE_MILISECONDS);
    if (hour > 0) return `${hour} giờ`;

    // tính phút
    const minute = Math.floor(numberMiliseconds / MINUTE_MILISECONDS);
    if (minute > 0) return `${minute} phút`;

    return 'Vài giây';
  }

  public static formatAMPM(date: Date) {
    const localDate = date.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
    const localCreatedAtDate = new Date(localDate);
    let hours = localCreatedAtDate.getHours();
    let minutes: any = localCreatedAtDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
}
