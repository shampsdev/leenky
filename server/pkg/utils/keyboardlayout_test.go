package utils

import "testing"

func TestSwapKeyboardLayout(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"ghbdtn", "привет"},
		{"Ghbdtn", "Привет"},
		{"hello", "руддщ"},
		{"ytgjyznyj", "непонятно"},
		{"", ""},
		{"Qwerty", "Йцукен"},
		{"123", "123"},
		{".,';']", "юбэжэъ"},
	}

	for _, tt := range tests {
		t.Run(tt.input, func(t *testing.T) {
			result := SwapKeyboardLayout(tt.input)
			if result != tt.expected {
				t.Errorf("transliterate(%q) = %q; expected %q", tt.input, result, tt.expected)
			}
		})
	}
}
