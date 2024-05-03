package shopModel

import (
	"gorn/app/hmodel"
	"gorn/app/model"
	"gorn/gorn"
	"strconv"
)

type ShopProduct struct {
	model.BaseModel
	Title        string       `gorm:"size:255" json:"title"`
	Url          string       `gorm:"size:255;index:url_idx" json:"url"`
	UserId       uint         `gorm:"index" json:"user_id"`
	CategoryId   uint         `gorm:"index" json:"category_id"`
	Status       uint8        `json:"status" gorm:"index:status_idx"`
	User         hmodel.User  `json:"user"`
	ShortContent string       `json:"short_content"`
	Content      string       `json:"content"`
	CommentAllow bool         `json:"comment_allow"`
	Category     ShopCategory `json:"category"`
	Stock        uint         `json:"stock"`
	Params       []ShopParam  `gorm:"foreignKey:ProductId" json:"params"`
	Prices       []ShopPrice  `gorm:"foreignKey:ProductId" json:"prices"`
}

func (g *ShopProduct) SaveQuestions(userid uint, productid uint, body map[string]any) {
	if body["question"] == nil {
		return
	}

	questions := body["question"].(map[string]any)

	for questionId, value := range questions {
		param := ShopParam{}
		v, _ := strconv.Atoi(questionId[1 : len(questionId)-1])

		check := gorn.DB.Where("product_id = ? and question_id = ? ", productid, v).First(&param)
		if check.RowsAffected == 0 {
			param = ShopParam{}
		}

		answer := ShopParamAnswer{}
		cAnswer := gorn.DB.Where("question_id = ? and title = ?", v, value).First(&answer)

		if cAnswer.RowsAffected == 0 && value.(string) != "" {
			answer.Title = value.(string)
			answer.UserId = userid
			answer.QuestionId = uint(v)
			gorn.DB.Save(&answer)
		}

		if value.(string) != "" {
			param.AnswerId = answer.ID
			param.QuestionId = uint(v)
			param.ProductId = productid
			param.UserId = userid
			gorn.DB.Save(&param)
		}

	}
}
