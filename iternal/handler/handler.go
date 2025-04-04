package handlers

import (
	"github.com/gin-gonic/gin"
	"insurance/iternal/service"
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

	//api := router.Group("/users")
	//{
	//	api.POST("/", h.CreateUser)
	//	api.GET("/", h.GetAllUsersList)
	//	api.GET("/:id", h.GetUserById)
	//	api.DELETE("/:id", h.DeleteUserById)
	//	api.PUT("/:id", h.UpdateUserById)
	//}
	//
	//testApi := router.Group("/testing", h.userIdentity)
	//{
	//	testApi.GET("/check-token", h.Check)
	//	testApi.GET("/admin", h.AdminCheck)
	//	testApi.GET("/user", h.UserCheck)
	//}
	//
	//auth := router.Group("/auth")
	//{
	//	auth.POST("/sign-in", h.signIn)
	//	auth.POST("/sign-up", h.CreateUser)
	//}

	return router
}

func (h *Handler) Temp(c *gin.Context) {
	c.JSON(http.StatusOK, "hello")
}
