package model

type Permission struct {
	ID      uint
	UserID  uint   `json:"user_id"`
	GroupID uint   `json:"group_id"`
	Model   string `json:"model"`
	View    bool   `json:"view"`
	Update  bool   `json:"update"`
	Create  bool   `json:"create"`
	Delete  bool   `json:"delete"`
}
