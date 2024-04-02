package gorn

import "golang.org/x/exp/maps"

type Setter struct {
	sets map[string]any
}

func (s *Setter) Init() {
	s.sets = make(map[string]any)
}

func (s *Setter) Clear() {
	maps.Clear(s.sets)
}

func (s *Setter) Get() map[string]any {
	return s.sets
}

func (s *Setter) Set(key string, value any) {
	s.sets[key] = value
}
