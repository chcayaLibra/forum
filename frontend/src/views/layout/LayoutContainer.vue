<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
import ScrollContainer from '@/components/ScrollContainer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const uniquekey = computed(() => {
  return route.meta.unique ? route.fullPath : route.params.id
})
</script>

<template>
  <div id="app">
    <div class="aside">
      <ul class="function">
        <li>
          <router-link to="/post">
            <div class="icon" title="帖子">
              <svg
                t="1742023839039"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4677"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32"
                height="32"
              >
                <path
                  d="M757.333333 324.16V112a5.333333 5.333333 0 0 0-5.333333-5.333333H112a5.333333 5.333333 0 0 0-5.333333 5.333333v800a5.333333 5.333333 0 0 0 5.333333 5.333333h714.666667a90.666667 90.666667 0 0 0 90.666666-90.666666V334.826667a5.333333 5.333333 0 0 0-5.333333-5.333334h-149.333333a5.333333 5.333333 0 0 1-5.333334-5.333333zM677.333333 842.666667H186.666667a5.333333 5.333333 0 0 1-5.333334-5.333334V186.666667a5.333333 5.333333 0 0 1 5.333334-5.333334h490.666666a5.333333 5.333333 0 0 1 5.333334 5.333334v650.666666a5.333333 5.333333 0 0 1-5.333334 5.333334z m122.666667 0a42.666667 42.666667 0 0 1-42.666667-42.666667V409.493333a5.333333 5.333333 0 0 1 5.333334-5.333333h74.666666a5.333333 5.333333 0 0 1 5.333334 5.333333V800a42.666667 42.666667 0 0 1-42.666667 42.666667z"
                  p-id="4678"
                ></path>
                <path
                  d="M258.186667 307.52m5.333333 0l336.96 0q5.333333 0 5.333333 5.333333l0 64q0 5.333333-5.333333 5.333334l-336.96 0q-5.333333 0-5.333333-5.333334l0-64q0-5.333333 5.333333-5.333333Z"
                  p-id="4679"
                ></path>
                <path
                  d="M258.186667 460.053333m5.333333 0l336.96 0q5.333333 0 5.333333 5.333334l0 64q0 5.333333-5.333333 5.333333l-336.96 0q-5.333333 0-5.333333-5.333333l0-64q0-5.333333 5.333333-5.333334Z"
                  p-id="4680"
                ></path>
                <path
                  d="M258.186667 612.586667m5.333333 0l213.066667 0q5.333333 0 5.333333 5.333333l0 64q0 5.333333-5.333333 5.333333l-213.066667 0q-5.333333 0-5.333333-5.333333l0-64q0-5.333333 5.333333-5.333333Z"
                  p-id="4681"
                ></path>
              </svg>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="/chat">
            <div class="icon" title="关注">
              <svg
                t="1742023892396"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5675"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32"
                height="32"
              >
                <path
                  d="M480.304762 237.738667l7.582476 7.68c6.826667 6.826667 14.872381 14.677333 24.112762 23.576381l10.50819-10.191238c8.289524-8.045714 15.36-15.067429 21.211429-21.065143a220.891429 220.891429 0 0 1 317.074286 0c86.747429 88.600381 87.576381 231.765333 2.438095 321.365333L512 902.095238 160.768 559.128381c-85.113905-89.624381-84.309333-232.789333 2.438095-321.389714a220.891429 220.891429 0 0 1 317.074286 0z m335.043048 265.313523c52.882286-61.44 50.492952-155.599238-6.826667-214.137904a147.748571 147.748571 0 0 0-212.553143 0l-17.286095 17.261714a1928.289524 1928.289524 0 0 1-5.022476 4.924952L512 370.492952l-56.32-54.223238-15.11619-14.774857-12.53181-12.580571a147.748571 147.748571 0 0 0-212.577524 0c-58.806857 60.074667-59.782095 157.671619-2.511238 218.940952L512 799.865905l299.056762-292.035048 4.291048-4.778667z"
                  p-id="5676"
                ></path>
              </svg>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="/publish">
            <div class="icon" title="新帖子">
              <svg
                t="1743324250403"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4552"
                width="32"
                height="32"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  d="M554.666667 170.666667a42.666667 42.666667 0 1 0-85.333334 0v298.666666H170.666667a42.666667 42.666667 0 1 0 0 85.333334h298.666666v298.666666a42.666667 42.666667 0 1 0 85.333334 0v-298.666666h298.666666a42.666667 42.666667 0 0 0 0-85.333334h-298.666666V170.666667z"
                  p-id="4553"
                ></path>
              </svg>
            </div>
          </router-link>
        </li>
        <li>
          <router-link to="/user">
            <div class="icon" title="我的">
              <svg
                t="1742023906999"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6682"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32"
                height="32"
              >
                <path
                  d="M800 384c0-160-128-288-288-288s-288 128-288 288c0 108.8 57.6 201.6 147.2 249.6-121.6 48-214.4 153.6-240 288-3.2 16 6.4 35.2 25.6 38.4h6.4c16 0 28.8-9.6 32-25.6 28.8-150.4 160-259.2 313.6-262.4h6.4c156.8 0 284.8-128 284.8-288zM288 384c0-124.8 99.2-224 224-224s224 99.2 224 224c0 121.6-99.2 220.8-220.8 224H505.6C384 604.8 288 505.6 288 384zM723.2 675.2c-16-9.6-35.2-6.4-44.8 9.6-9.6 16-6.4 35.2 9.6 44.8 73.6 51.2 124.8 121.6 140.8 204.8 3.2 16 16 25.6 32 25.6h6.4c16-3.2 28.8-19.2 25.6-38.4-19.2-99.2-80-185.6-169.6-246.4z"
                  p-id="6683"
                ></path>
              </svg>
            </div>
          </router-link>
        </li>
        <li class="fit-screen">
          <router-link to="/setting">
            <div class="icon" title="设置">
              <svg
                t="1742024095993"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7678"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32"
                height="32"
              >
                <path
                  d="M812.6976 195.976533L936.021333 409.6a204.8 204.8 0 0 1 0 204.8L812.714667 828.023467a204.8 204.8 0 0 1-177.373867 102.4H388.676267a204.8 204.8 0 0 1-177.373867-102.4L87.978667 614.4a204.8 204.8 0 0 1 0-204.8l123.323733-213.623467a204.8 204.8 0 0 1 177.373867-102.4h246.647466a204.8 204.8 0 0 1 177.373867 102.4z m-59.118933 34.133334a136.533333 136.533333 0 0 0-118.254934-68.266667H388.676267a136.533333 136.533333 0 0 0-118.254934 68.266667L147.114667 443.733333a136.533333 136.533333 0 0 0 0 136.533334l123.323733 213.623466a136.533333 136.533333 0 0 0 118.254933 68.266667h246.647467a136.533333 136.533333 0 0 0 118.254933-68.266667L876.885333 580.266667a136.533333 136.533333 0 0 0 0-136.533334l-123.323733-213.623466z"
                  p-id="7679"
                ></path>
                <path
                  d="M512 682.666667c94.2592 0 170.666667-76.407467 170.666667-170.666667s-76.407467-170.666667-170.666667-170.666667-170.666667 76.407467-170.666667 170.666667 76.407467 170.666667 170.666667 170.666667z m0-68.266667a102.4 102.4 0 1 1 0-204.8 102.4 102.4 0 0 1 0 204.8z"
                  p-id="7680"
                ></path>
              </svg>
            </div>
          </router-link>
        </li>
      </ul>
      <ul class="system">
        <li>
          <ThemeToggle></ThemeToggle>
        </li>
        <li>
          <router-link to="/setting">
            <div class="icon" title="设置">
              <svg
                t="1742024095993"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7678"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="32"
                height="32"
              >
                <path
                  d="M812.6976 195.976533L936.021333 409.6a204.8 204.8 0 0 1 0 204.8L812.714667 828.023467a204.8 204.8 0 0 1-177.373867 102.4H388.676267a204.8 204.8 0 0 1-177.373867-102.4L87.978667 614.4a204.8 204.8 0 0 1 0-204.8l123.323733-213.623467a204.8 204.8 0 0 1 177.373867-102.4h246.647466a204.8 204.8 0 0 1 177.373867 102.4z m-59.118933 34.133334a136.533333 136.533333 0 0 0-118.254934-68.266667H388.676267a136.533333 136.533333 0 0 0-118.254934 68.266667L147.114667 443.733333a136.533333 136.533333 0 0 0 0 136.533334l123.323733 213.623466a136.533333 136.533333 0 0 0 118.254933 68.266667h246.647467a136.533333 136.533333 0 0 0 118.254933-68.266667L876.885333 580.266667a136.533333 136.533333 0 0 0 0-136.533334l-123.323733-213.623466z"
                  p-id="7679"
                ></path>
                <path
                  d="M512 682.666667c94.2592 0 170.666667-76.407467 170.666667-170.666667s-76.407467-170.666667-170.666667-170.666667-170.666667 76.407467-170.666667 170.666667 76.407467 170.666667 170.666667 170.666667z m0-68.266667a102.4 102.4 0 1 1 0-204.8 102.4 102.4 0 0 1 0 204.8z"
                  p-id="7680"
                ></path>
              </svg>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <scroll-container class="item" :keyPath="$route.path">
      <router-view v-slot="{ Component }">
        <keep-alive :include="['PostList', 'UserPage', 'FollowDetail']">
          <component :is="Component" :key="uniquekey"></component>
        </keep-alive>
      </router-view>
    </scroll-container>
  </div>
</template>

<style scoped lang="scss">
#app {
  $main-gap: 20px;
  display: grid;
  grid-template-columns: 70px 1fr;
  width: 100%;
  height: 100dvh;
  overflow: hidden;

  .icon {
    width: 32px;
    height: 32px;
    svg {
      fill: var(--font-color);
      transition: all 0.3s ease;
      cursor: pointer;
      // &:hover {
      //   filter: drop-shadow(0 0 1px var(--font-color));
      // }
    }
  }

  .aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    height: 100dvh;
    padding: $main-gap 0;
    box-shadow: 1px 0 4px var(--aside-shadow);
    transition: all 0.3s ease;
    background-color: var(--theme-aside-color);

    .function {
      display: grid;
      gap: $main-gap;
      margin-bottom: $main-gap;

      .fit-screen {
        display: none;
      }
    }

    .system {
      display: grid;
      gap: $main-gap;
      margin-top: auto;
    }
  }

  .item {
    display: grid;
    height: 100dvh;
    padding: $main-gap;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .router-link-active {
    width: 32px;
    height: 32px;
    display: grid;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    box-shadow: 0 0 0 6px var(--active-color);
    transition: all 0.1s ease;
    background-color: var(--active-color);
  }

  // @media (max-height: 280px) {
  //   .aside {
  //     display: none;
  //   }
  // }

  @media (max-width: 520px) {
    #app {
      display: grid;
      grid-template-rows: 1fr 70px;

      .aside {
        position: fixed;
        bottom: -1px;
        z-index: 199;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 70px;

        .system {
          display: none;
        }

        .function {
          width: 80%;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          // gap: $main-gap * 2.5;
          justify-items: center;
          margin-bottom: 0;

          .fit-screen {
            display: list-item;
          }
        }
      }

      .item {
        width: 100dvw;
        padding-bottom: 90px;
      }
    }
  }

  @media (max-width: 360px) {
    #app {
      .item {
        height: 100vh;
      }

      .item {
        width: 100vw;
      }
    }
  }
}
</style>
