package utils

import "testing"

func TestTransliterate(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"Hello", "Хелло"},
		{"Привет", "Privet"},
		{"Тимур", "Timur"},
		{"Timur", "Тимур"},
	}
	for _, test := range tests {
		result := Transliterate(test.input)
		if result != test.expected {
			t.Errorf("Transliterate(%q) = %q, expected %q", test.input, result, test.expected)
		}
	}
}
