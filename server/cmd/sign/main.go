package main

import (
	"fmt"
	"time"

	"github.com/shampsdev/tglinked/server/cmd/config"
	initdata "github.com/telegram-mini-apps/init-data-golang"
)

func main() {
	initData := "user=%7B%22id%22%3A870732774%2C%22first_name%22%3A%22%D0%92%D0%B0%D0%BD%D1%8F%20%7C%20%D0%92%D0%B0%D0%BD%D1%8F%20%D0%A2%D0%B0%D1%80%D0%B0%D1%81%D0%BE%D0%B2%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22vaniog%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fl7ONTLqkvTR8zaSGvrobufOmH-BN65JS1ZM1-5kjEsQ.svg%22%7D&chat_instance=8882418812383372653&chat_type=sender"

	authDate := time.Now()
	cfg := config.Load(".env")

	hash, err := initdata.SignQueryString(initData, cfg.TG.BotToken, authDate)

	if err != nil {
		panic(err)
	}
	initData += "&hash=" + hash
	initData += fmt.Sprintf("&auth_date=%d", authDate.Unix())
	fmt.Println(initData)
}
