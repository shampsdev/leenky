import { useState } from "react";
import TrashBin from "../assets/white_trash_bin.svg";
import { FieldType } from "../types/fields/field.type";
import TextinputIconDeactivate from "../assets/fieldIcons/textinput_deactivate.svg";
import TextareaIconActivate from "../assets/fieldIcons/textarea_activate.svg";
import TextinputIconActivate from "../assets/fieldIcons/textinput_activate.svg";
import TextareaIconDeactivate from "../assets/fieldIcons/textarea_deactivate.svg";

interface CommunityProfileFieldProps {
  handleDelete: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  type: FieldType;
  onTypeChange: (type: FieldType) => void;
}

const CommunityProfileField = (props: CommunityProfileFieldProps) => {
  const [fieldType, setFieldType] = useState<FieldType>(props.type);

  const getFieldImage = () => {
    switch (fieldType) {
      case "textinput":
        return TextinputIconDeactivate;
      case "textarea":
        return TextareaIconDeactivate;
    }
  };

  const preventTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-row gap-[12px]">
      <div
        className="flex flex-1 relative flex-row items-center border-[#F5F5F5] border-[2px] text-[#A2ACB0] pl-[16px] py-[12px] rounded-[14px] gap-[10px]"
        style={{ touchAction: "none" }}
      >
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          className="outline-none w-[80%]"
          placeholder="Название поля"
          onTouchStart={preventTouch}
        />
        <img
          className="absolute right-[18px]"
          src={getFieldImage()}
          onClick={props.onOpen}
          onTouchStart={preventTouch}
        />
        {props.isOpen && (
          <div className="flex flex-col gap-[12px] absolute right-0 translate-x-[2px] translate-y-[-2px] top-0 border-[#F5F5F5] z-10 border-[2px] text-[#A2ACB0] rounded-[14px] py-[12px] px-[16px] bg-white">
            {fieldType === "textarea" && (
              <>
                <div
                  className="flex flex-row items-center justify-end gap-[12px] text-black"
                  onClick={() => {
                    setFieldType("textarea");
                    props.onTypeChange("textarea");
                    props.onClose();
                  }}
                  onTouchStart={preventTouch}
                >
                  абзац
                  <img src={TextareaIconActivate} alt="Textarea active" />
                </div>
                <div
                  className="flex flex-row gap-[12px] items-center"
                  onClick={() => {
                    setFieldType("textinput");

                    props.onTypeChange("textinput");
                    props.onClose();
                  }}
                  onTouchStart={preventTouch}
                >
                  строка
                  <img
                    src={TextinputIconDeactivate}
                    alt="Textinput deactivate"
                  />
                </div>
              </>
            )}
            {fieldType === "textinput" && (
              <>
                <div
                  className="flex flex-row gap-[12px] text-black items-center justify-end"
                  onClick={() => {
                    setFieldType("textinput");

                    props.onTypeChange("textinput");
                    props.onClose();
                  }}
                  onTouchStart={preventTouch}
                >
                  строка
                  <img src={TextinputIconActivate} alt="Textinput active" />
                </div>
                <div
                  className="flex flex-row gap-[12px] items-center justify-end"
                  onClick={() => {
                    setFieldType("textarea");
                    props.onTypeChange("textarea");
                    props.onClose();
                  }}
                  onTouchStart={preventTouch}
                >
                  абзац
                  <img src={TextareaIconDeactivate} alt="Textarea deactivate" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div
        className="bg-[#F34338] px-[16px] py-[14px] rounded-[14px]"
        onTouchStart={preventTouch}
      >
        <img src={TrashBin} alt="Удалить" onClick={props.handleDelete} />
      </div>
    </div>
  );
};

export default CommunityProfileField;
