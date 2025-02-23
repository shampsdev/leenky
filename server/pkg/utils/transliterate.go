package utils

import (
	"strings"
	"unicode"
)

var rusToEng = map[rune]string{
	'А': "A", 'а': "a", 'Б': "B", 'б': "b", 'В': "V", 'в': "v",
	'Г': "G", 'г': "g", 'Д': "D", 'д': "d", 'Е': "E", 'е': "e",
	'Ё': "Yo", 'ё': "yo", 'Ж': "Zh", 'ж': "zh", 'З': "Z", 'з': "z",
	'И': "I", 'и': "i", 'Й': "Y", 'й': "y", 'К': "K", 'к': "k",
	'Л': "L", 'л': "l", 'М': "M", 'м': "m", 'Н': "N", 'н': "n",
	'О': "O", 'о': "o", 'П': "P", 'п': "p", 'Р': "R", 'р': "r",
	'С': "S", 'с': "s", 'Т': "T", 'т': "t", 'У': "U", 'у': "u",
	'Ф': "F", 'ф': "f", 'Х': "Kh", 'х': "kh", 'Ц': "Ts", 'ц': "ts",
	'Ч': "Ch", 'ч': "ch", 'Ш': "Sh", 'ш': "sh", 'Щ': "Shch", 'щ': "shch",
	'Ъ': "", 'ъ': "", 'Ы': "Y", 'ы': "y", 'Ь': "", 'ь': "",
	'Э': "E", 'э': "e", 'Ю': "Yu", 'ю': "yu", 'Я': "Ya", 'я': "ya",
}

var engToRus = map[string]string{
	"A": "А", "a": "а", "B": "Б", "b": "б", "V": "В", "v": "в",
	"G": "Г", "g": "г", "D": "Д", "d": "д", "E": "Е", "e": "е",
	"Yo": "Ё", "yo": "ё", "Zh": "Ж", "zh": "ж", "Z": "З", "z": "з",
	"I": "И", "i": "и", "Y": "Й", "y": "й", "K": "К", "k": "к",
	"L": "Л", "l": "л", "M": "М", "m": "м", "N": "Н", "n": "н",
	"O": "О", "o": "о", "P": "П", "p": "п", "R": "Р", "r": "р",
	"S": "С", "s": "с", "T": "Т", "t": "т", "U": "У", "u": "у",
	"F": "Ф", "f": "ф", "H": "Х", "h": "х", "Ts": "Ц", "ts": "ц",
	"Ch": "Ч", "ch": "ч", "Sh": "Ш", "sh": "ш", "Shch": "Щ", "shch": "щ",
	"": "Ь", "Yu": "Ю", "yu": "ю", "Ya": "Я", "ya": "я",
}

func transliterateRusToEng(text string) string {
	var result strings.Builder
	for _, char := range text {
		if eng, found := rusToEng[char]; found {
			result.WriteString(eng)
		} else {
			result.WriteRune(char)
		}
	}
	return result.String()
}

func transliterateEngToRus(text string) string {
	var result strings.Builder
	i := 0
	for i < len(text) {
		matchFound := false
		for j := 2; j > 0; j-- {
			if i+j <= len(text) {
				substr := text[i : i+j]
				if rus, found := engToRus[substr]; found {
					result.WriteString(rus)
					i += j
					matchFound = true
					break
				}
			}
		}
		if !matchFound {
			result.WriteByte(text[i])
			i++
		}
	}
	return result.String()
}

func isRussian(text string) bool {
	for _, char := range text {
		if unicode.Is(unicode.Cyrillic, char) {
			return true
		}
	}
	return false
}

func Transliterate(text string) string {
	if isRussian(text) {
		return transliterateRusToEng(text)
	}
	return transliterateEngToRus(text)
}
