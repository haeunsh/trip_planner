import { useValueWithTimezone } from "@mui/x-date-pickers/internals/hooks/useValueWithTimezone";
import "./formFrm.css";

const Input = (props) => {
  const type = props.type;
  const placeholder = props.placeholder;
  const content = props.content;
  const data = props.data; //input태그와 연결할 state
  const setData = props.setData; //state 값 변경 함수
  const clickEvent = props.clickEvent;
  const blurEvent = props.blurEvent;
  const readOnly = props.readOnly;
  const disabled = props.disabled;
  const inputRef = props.inputRef;
  const keyupEvent = props.keyupEvent;
  const keyDownEvent = props.keyDownEvent;
  const changeData = (e) => {
    setData(e.target.value);
  };
  return (
    <input
      className="input"
      id={content}
      placeholder={placeholder}
      type={type}
      value={data || ""}
      onChange={changeData}
      ref={inputRef}
      onKeyUp={keyupEvent}
      onClick={clickEvent}
      onBlur={blurEvent}
      onKeyDown={keyDownEvent}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};

const Button = (props) => {
  const id = props.id;
  const text = props.text;
  const clickEvent = props.clickEvent;
  const className = props.class;
  const disabled = props.disabled;
  
  return (
    <button type="button" id={id} className={className} onClick={clickEvent} disabled={disabled}>
      {text}
    </button>
  );
};

const Textarea = (props) => {
  const data = props.data;
  const setData = props.setData;
  const placeholder = props.placeholder;
  const changeData = (e) => {
    setData(e.target.value);
  };

  return(
    <div className="textarea">
      <textarea placeholder={placeholder} value={data || ""} onChange={changeData}></textarea>
    </div>
  );
}

const Select = (props) => {
  const options = props.options;
  const data = props.data;
  const setData = props.setData;
  const changeData = (e) => {
    setData(e.target.value);
  };

  return(
    <div className="select">
      <select onChange={changeData} value={data}>
        {
          options.map((item, i) => {
            return <option key={"option"+i} value={item}>{item}</option>
          })
        }
      </select>
    </div>
  );
}

export { Input, Button, Textarea, Select };
