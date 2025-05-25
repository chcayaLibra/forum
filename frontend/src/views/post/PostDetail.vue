<script setup>
import { postCommentListService } from '@/api/post'
import CommentCard from './components/CommentCard.vue'
import CommentInput from './components/CommentInput.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref, watchEffect } from 'vue'
import PostCard from './components/PostCard.vue'
import { usePostStore, useUserStore } from '@/stores'

const route = useRoute()
const postStore = usePostStore()
const userStore = useUserStore()

const postDetail = ref()
const commentList = ref()

const id = route.params.id

const getPostDetail = async () => {
  await postStore.getPostDetail(id)
  postDetail.value = postStore.postDetail
}

watchEffect(() => {
  postDetail.value = postStore.postDetail
})

const getCommentList = async () => {
  const res = await postCommentListService(id)
  if (!res) return
  commentList.value = res.data.data
}

onMounted(() => {
  getPostDetail()
  getCommentList()
})

const onUpdateCommentList = () => {
  getCommentList()
}

userStore.getUserFollowList()
userStore.getUserCollectPidList(userStore.userId)
</script>

<template>
  <div class="container">
    <div class="detail">
      <post-card
        v-if="postDetail"
        :post="postDetail"
        :userCollectPidList="userStore.userCollectPidList"
      >
        <template #back>&lt;</template>
      </post-card>
    </div>
    <div v-if="postDetail" class="comments">
      <div class="function">
        <comment-input
          :id
          @update-comment-list="onUpdateCommentList"
        ></comment-input>
      </div>
      <div v-if="commentList" class="comment">
        <div class="tip" v-if="commentList && commentList.length === 0">
          暂时没有评论...
        </div>
        <comment-card
          v-for="item in commentList"
          :key="item.comment_id"
          :item
        ></comment-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$main-gap: 20px;
$img-size: 155px;
.container {
  display: flex;
  flex-direction: column;
  gap: $main-gap;
  padding: $main-gap;

  .detail {
    gap: $main-gap;
    width: 100%;
    height: auto;
  }

  .comments {
    display: flex;
    flex-direction: column;
    padding: $main-gap;
    width: 100%;
    height: auto;
    max-height: 85dvh;
    overflow-y: scroll;
    border-radius: calc($main-gap / 2);
    line-height: 1.5;
    background-color: var(--postcard-main-color);
    box-shadow: 0 0 5px var(--aside-shadow);

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .function {
      position: sticky;
      top: 0;
    }

    .comment {
      display: flex;
      flex-direction: column;
      gap: $main-gap;
      margin-top: $main-gap;

      .tip {
        text-align: center;
        font-size: 12px;
        line-height: 5;
      }
    }
  }

  @media (min-width: 850px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
