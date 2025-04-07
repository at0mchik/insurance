package handler

import (
	"github.com/gin-gonic/gin"
	"insurance/internal/service"
	"net/http"
)

type Handler struct {
	services *service.Service
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{services: services}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	temp := router.Group("/temp")
	{
		temp.GET("/", h.Temp)
	}

	api := router.Group("/api")
	{
		user := api.Group("/user")
		{
			user.POST("/")
			user.GET("/")
			user.GET("/:id")
			user.DELETE("/:id")
			user.PUT("/:id")
		}
	}

	return router
}

func (h *Handler) Temp(c *gin.Context) {
	c.JSON(http.StatusOK, "hello")
}
