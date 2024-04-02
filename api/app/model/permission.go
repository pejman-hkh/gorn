package model

type Permission struct {
	ID        uint
	UserID    uint
	GroupID   uint
	Model     string
	Show      bool
	Update    bool
	Create    bool
	List      bool
	Delete    bool
	DeleteAll bool
}
