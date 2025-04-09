package app

import (
	"fmt"
	_ "github.com/lib/pq"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
	"insurance/internal/config"
	"insurance/internal/handler"
	"insurance/internal/repository"
	"insurance/internal/service"
	"insurance/pkg/auth"
	"insurance/pkg/server"
)

func Run(configPath string) {
	logrus.Info("application startup...")
	logrus.Info("logger initialized")

	cfg := config.GetConfig(configPath)

	db, err := sqlx.Connect("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		cfg.DB.Host, cfg.DB.Port, cfg.DB.Username, cfg.DB.DBName, cfg.DB.Password, cfg.DB.SSLMode))

	if err != nil {
		logrus.Fatalf("failed to initalizate db: %s", err.Error())
	}

	repos := repository.NewRepository(db)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)
	auth.SetSalt(cfg.Pkg.Salt)
	auth.SetSigningKey(cfg.Pkg.JwtKey)
	logrus.Info("repositories, services, handlers initialized")

	srv := new(server.Server)
	if err := srv.Run(cfg.Server.Port, handlers.InitRoutes()); err != nil {
		logrus.Fatalf("error while running http server: %s", err.Error())
	}
}
