package apphooks

import (
	"github.com/mikestefanello/hooks"
)

type FollowPayload struct {
	UserID   uint
	ShowID   uint
	Followed bool
}

var OnFollow = hooks.NewHook[FollowPayload]("follow")
var OnUnfollow = hooks.NewHook[FollowPayload]("unfollow")
