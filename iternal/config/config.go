package config

import (
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"os"
	"strings"
	"sync"
)

type Config struct {
	DB struct {
		Host     string
		Port     string
		Username string
		Password string
		DBName   string
		SSLMode  string
	}

	Server struct {
		Port string
	}
}

func initConfig(configPath string) error {
	pathSplit := strings.Split(configPath, "/")

	viper.SetConfigType("yaml")
	viper.AddConfigPath(pathSplit[0])
	viper.SetConfigName(pathSplit[1])
	return viper.ReadInConfig()
}

var instance *Config
var once sync.Once

func GetConfig(configPath string) *Config {
	once.Do(func() {
		logrus.Infof("read config file: %s", configPath)
		instance = &Config{}

		if err := initConfig(configPath); err != nil {
			logrus.Fatal("error initializing configs: %s", err.Error())
		}

		logrus.Infof("read env file: %s", configPath)
		if err := godotenv.Load(); err != nil {
			logrus.Fatalf("error loading env variables: %s", err.Error())
		}

		instance.DB.Password = os.Getenv("DB_PASSWORD")
		instance.DB.Host = viper.GetString("db.host")
		instance.DB.Port = viper.GetString("db.port")
		instance.DB.Username = viper.GetString("db.username")
		instance.DB.DBName = viper.GetString("db.dbname")
		instance.DB.SSLMode = viper.GetString("db.sslmode")

		instance.Server.Port = viper.GetString("server.port")

		logrus.Infof("port %s", instance.Server.Port)
	})

	return instance
}
