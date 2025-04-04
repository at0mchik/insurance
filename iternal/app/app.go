package app

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"insurance/iternal/config"
	"insurance/iternal/handler"
	"insurance/iternal/repository"
	"insurance/iternal/service"
	"insurance/pkg/server"
)

func Run(configPath string) {
	logrus.Info("application startup...")
	logrus.Info("logger initialized")

	cfg := config.GetConfig(configPath)

	db, err := sqlx.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		cfg.DB.Host, cfg.DB.Port, cfg.DB.Username, cfg.DB.DBName, cfg.DB.Password, cfg.DB.SSLMode))

	if err != nil {
		logrus.Fatalf("failed to initalizate db: %s", err.Error())
	}

	repos := repository.NewRepository(db)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)
	logrus.Info("repositories, services, handlers initialized")

	srv := new(server.Server)
	if err := srv.Run(cfg.Server.Port, handlers.InitRoutes()); err != nil {
		logrus.Fatalf("error while running http server: %s", err.Error())
	}
}
