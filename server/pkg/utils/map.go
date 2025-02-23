package utils

func Map[T, S any](f func(T) S, slice []T) []S {
	result := make([]S, len(slice))
	for i, v := range slice {
		result[i] = f(v)
	}
	return result
}
