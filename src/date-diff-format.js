import moment from 'moment';

export class DateDiffFormatValueConverter {
   toView(value, reference) {
       return moment.duration(value-reference).humanize(true);
   }
}
