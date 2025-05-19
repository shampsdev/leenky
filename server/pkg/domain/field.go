package domain

type FieldType string

const (
	FieldTypeTextinput FieldType = "textinput"
	FieldTypeTextarea  FieldType = "textarea"
)

type Field struct {
	Type        FieldType `json:"type"`
	Title       string    `json:"title"`
	Description string    `json:"description"`

	Textinput *FieldTextinput `json:"textinput,omitempty"`
	Textarea  *FieldTextarea  `json:"textarea,omitempty"`
}

type FieldValue struct {
	Type      FieldType            `json:"type"`
	Textarea  *FieldValueTextarea  `json:"textarea,omitempty"`
	Textinput *FieldValueTextinput `json:"textinput,omitempty"`
}

type FieldTextinput struct {
	Default string `json:"default"`
}

type FieldTextarea struct {
	Default string `json:"default"`
}

type FieldValueTextarea struct {
	Value string `json:"value"`
}

type FieldValueTextinput struct {
	Value string `json:"value"`
}

func (v FieldValue) String() string {
	switch v.Type {
	case FieldTypeTextinput:
		return v.Textinput.Value
	case FieldTypeTextarea:
		return v.Textarea.Value
	default:
		return ""
	}
}
