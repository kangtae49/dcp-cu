import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState} from "react";
import { ko } from 'date-fns/locale';
import "./MonthPicker.css"
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faCalendar} from "@fortawesome/free-solid-svg-icons"

interface Props {
  initialDate?: Date | null
  onChange?: (date: Date | null) => void
}

function MonthPicker ({initialDate, onChange}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate ?? new Date());

  const handleChange = (date: Date | null) => {
    console.log(date)
    setSelectedDate(date)

    if (onChange) {
      onChange(date)
    }
  }
  return (
    <div className="month-picker">
      <DatePicker

        // withPortal
        showIcon
        locale={ko}
        showMonthYearPicker
        popperPlacement="bottom-start"
        todayButton="오늘"
        dateFormat="yyyy-MM"
        showYearDropdown
        scrollableYearDropdown
        icon={<Icon icon={faCalendar} />}
        yearDropdownItemNumber={15}
        selected={selectedDate}
        onChange={(date) => handleChange(date)}
      />
    </div>
  );
}

export default MonthPicker;