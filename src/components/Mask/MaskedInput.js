import React, { useEffect, useRef } from "react";
import IMask from "imask";
import Form from "react-bootstrap/Form";

export default function MaskedInput({
  value,
  onChange,
  mask,
  placeholder,
  disabled,
  isInvalid,
  name,
  id,
  className,
  required,
  autoFocus,
  ...rest
}) {
  const inputRef = useRef();

  useEffect(() => {
    if (!inputRef.current) return;

    const maskOptions = {
      mask: mask,
    };

    const imask = IMask(inputRef.current, maskOptions);

    imask.on("accept", () => {
      const fakeEvent = {
        target: {
          name,
          value: imask.value,
        },
      };
      onChange?.(fakeEvent);
    });

    return () => imask.destroy();
  }, [mask, onChange]);

  return (
    <Form.Control
      ref={inputRef}
      defaultValue={value}
      placeholder={placeholder}
      disabled={disabled}
      isInvalid={isInvalid}
      name={name}
      id={id}
      className={className}
      required={required}
      autoFocus={autoFocus}
      {...rest}
    />
  );
}
