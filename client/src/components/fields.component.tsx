import { useExtractFields } from "../hooks/utils/extractFields";
import { Community } from "../types/community/community.interface";
import { FieldValue } from "../types/fields/fieldValue.interface";
import InfoBlockComponent from "./infoBlock.component";
import InfoParagraphComponent from "./infoParagraph.component";

interface FieldsComponentProps {
  fields: Record<string, FieldValue>;
  community: Community;
}
const FieldsComponent = (props: FieldsComponentProps) => {
  const { textInputs, textAreas } = useExtractFields(props.fields);
  return (
    <div className="rounded-lg mt-4 mx-auto w-full">
      <div className="px-4 text-hint mb-2 mt-4 text-xl">
        {props.community.name}
      </div>
      <InfoBlockComponent>
        {textInputs.map((field, index) => (
          <InfoParagraphComponent
            title={field.name}
            content={field.value}
            key={index}
          />
        ))}
      </InfoBlockComponent>
      <div className="px-4 text-hint mb-2 mt-4 text-sm">ПОДРОБНЕЕ</div>
      <InfoBlockComponent>
        {textAreas.map((field, index) => (
          <InfoParagraphComponent
            title={field.name}
            content={field.value}
            key={index}
          />
        ))}
      </InfoBlockComponent>
    </div>
  );
};

export default FieldsComponent;
