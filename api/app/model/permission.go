package model

type Permission struct {
	ID      uint
	UserID  uint   `json:"userid"`
	GroupID uint   `json:"groupid"`
	Model   string `json:"model"`
	View    bool   `json:"view"`
	Update  bool   `json:"update"`
	Create  bool   `json:"create"`
	Delete  bool   `json:"delete"`
}
