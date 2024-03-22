package gorn

type Controller struct {
	sets map[string]any
}

func (c *Controller) Set(key string, value any) {
	if c.sets == nil {
		c.sets = make(map[string]any)
	}

	c.sets[key] = value
}

func (c *Controller) Get() map[string]any {
	return c.sets
}

func (c *Controller) Flash(args ...any) map[string]any {
	ret := make(map[string]any)
	if len(args) == 1 {
		ret["msg"] = args[0]
		ret["status"] = 1
		ret["data"] = c.Get()
		return ret
	}
	if len(args) == 2 {
		ret["msg"] = args[0]
		ret["status"] = args[1]
		ret["data"] = c.Get()
		return ret
	}

	ret["msg"] = args[0]
	ret["status"] = args[1]
	ret["data"] = args[2]
	return ret

}
