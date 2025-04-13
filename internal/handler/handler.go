package handler

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"insurance/internal/service"
	"net/http"
)

type Handler struct {
	Services   *service.Service
	GetUserCtx func(c *gin.Context) (int, string, error)
}

func NewHandler(Services *service.Service) *Handler {
	return &Handler{
		Services:   Services,
		GetUserCtx: GetUserCtxExport,
	}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Authorization"},
	}))

	temp := router.Group("/temp")
	{
		temp.GET("/", h.Temp)
	}

	api := router.Group("/api", h.UserIdentity)
	{
		user := api.Group("/user")
		{
			user.POST("/", h.CreateUser)
			user.GET("/by-token", h.GetUserByToken)
			user.GET("/", h.GetAllUsers)
			user.GET("/:id", h.GetUserById)
			user.DELETE("/:id", h.DeleteUserById)
			user.PUT("/:id", h.UpdateUserById)
		}
		policy := api.Group("/policy")
		{
			policy.POST("/", h.CreatePolicy)
			policy.GET("/by-id/:id", h.GetPolicyById)
			policy.GET("/user-token", h.GetAllPoliciesByUserToken)
			policy.GET("/user-id/:id", h.GetAllPoliciesByUserId)
			policy.GET("/all", h.GetAllPolicies)
			policy.DELETE("/:id", h.DeletePolicyById)
			policy.PUT("/:id", h.UpdatePolicyById)
		}

		assessment := api.Group("/assessment")
		{
			assessment.POST("/", h.CreateAssessmentRequestByToken)
			assessment.GET("/by-id/:id", h.GetAssessmentById)
			assessment.GET("/all", h.GetAllAssessments)
			assessment.GET("/user-token", h.GetAllAssessmentsByUserToken)
			assessment.GET("/user-id/:id", h.GetAllAssessmentsByUserId)
			assessment.PUT("/add-assessor", h.AssignAssessorToAssessment)
			assessment.PUT("/change-result/:id", h.ChangeResultAssessment)
			assessment.DELETE("/:id", h.DeleteAssessmentById)
			assessment.GET("/assessor-token", h.GetAllAssessmentsByAssessorToken)
			assessment.GET("/assessor-id/:id", h.GetAllAssessmentsByAssessorId)
			assessment.GET("/empty", h.GetAllPendingAssessments)
		}
	}

	auth := router.Group("/api/auth")
	{
		auth.POST("/sign-in", h.SignIn) //authentication
		auth.POST("/sign-up", h.SignUp) //registration
		//auth.GET("/parse", h.UserIdentity) //uncomment c.JSON in UserIdentity
	}

	return router
}

func (h *Handler) Temp(c *gin.Context) {
	c.JSON(http.StatusOK, "hello")
}
