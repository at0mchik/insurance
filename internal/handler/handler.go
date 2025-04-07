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
			user.POST("/", h.CreateUser)
			user.GET("/", h.GetAllUsers)
			user.GET("/:id", h.GetUserById)
			user.DELETE("/:id", h.DeleteUserById)
			user.PUT("/:id", h.UpdateUserById)
		}
		auth := api.Group("/auth")
		{
			auth.POST("/sign-in", h.SignIn) //authentication
			auth.POST("/sign-up", h.SignUp) //registration
			auth.GET("/parse", h.UserIdentity)
		}
	}

	return router
}

func (h *Handler) Temp(c *gin.Context) {
	c.JSON(http.StatusOK, "hello")
}
