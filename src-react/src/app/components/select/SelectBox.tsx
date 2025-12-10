import "./SelectBox.css"
import {Menu, MenuItem} from "@szhsin/react-menu";
import classNames from "classnames";
import {useState} from "react";
import {FontAwesomeIcon as Icon} from "@fortawesome/react-fontawesome"
import {faAngleDown} from "@fortawesome/free-solid-svg-icons"

interface Option {
  value: string,
  label: string,
}

interface Props {
  options: Option[],
  defaultValue?: string
  onChange?: (option: Option) => void
}

function SelectBox({options, defaultValue, onChange}: Props) {
  const initOption = options.find(option => option.value === defaultValue) ?? options[0];
  const [selectedOption, setSelectedOption] = useState(initOption);
  const clickOption = (option: Option) => {
    console.log(option);
    setSelectedOption(option);
    if (onChange) {
      onChange(option)
    }
  }

  return (
    <div className="just-select">

      <Menu menuButton={
        <div className="just-selected">
          <div className="just-selected-label">{selectedOption.label}</div>
          <div className="just-icon"><Icon icon={faAngleDown} /></div>
        </div>
      }
        overflow="auto"
      >
        {
          options.map((option, idx) =>
            <MenuItem key={idx}
              className={classNames(
                "just-option",
                {
                  "selected": option.value === selectedOption.value
                }
              )}
              onClick={() => clickOption(option)}
            >
              <div className="just-label">{option.label}</div>
            </MenuItem>
          )
        }
      </Menu>
    </div>
  )
}

export default SelectBox;
