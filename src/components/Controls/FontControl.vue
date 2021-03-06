<template>
  <div ref="fontComponent">
    <input
      ref="fontComponentInput"
      :value="searchTerm"
      @input="input"
      @focus="openFontList"
      @keypress.enter="selectHighlightedItem"
      @keydown.prevent.up="decrementKeyboardIndex"
      @keydown.prevent.down="incrementKeyboardIndex"
      :style="{ fontFamily: value }"
    />

    <ul class="searchable-select" v-show="showFontList">
      <li
        v-for="(font, index) in fontsToShow"
        :value="font"
        :key="font"
        @click="clickItem(font)"
        :class="{
          selected: value === font || index === keyboardSelectedIndex,
          keyboardSelected: index === keyboardSelectedIndex
        }"
      >
        <span :style="{ fontFamily: font }">{{ font }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import fontList from "font-list";

export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      defaultFonts: ["serif", "sans-serif", "cursive", "monospace"],
      fonts: [],
      showFontList: false,
      searchTerm: "",
      keyboardSelectedIndex: -1
    };
  },

  async created() {
    try {
      const fonts = await fontList.getFonts();
      this.fonts = [
        ...this.defaultFonts,
        ...fonts.map(font => font.replace(/"/g, ""))
      ];
    } catch (e) {
      console.error(e);
    }

    this.searchTerm = this.value;
  },

  mounted() {
    this.scrollSelectedItemIntoView();
  },

  beforeDestroy() {
    window.removeEventListener("click", this.checkClick);
  },

  computed: {
    fontsToShow() {
      if (this.value === this.searchTerm) {
        return this.fonts;
      }

      return this.fonts.filter(font => this.search(font, this.searchTerm));
    }
  },

  methods: {
    input(e) {
      const {
        target: { value }
      } = e;

      this.searchTerm = value;
    },

    setFont(font) {
      this.$emit("input", font);
      this.searchTerm = font;
    },

    openFontList() {
      this.showFontList = true;
      window.addEventListener("click", this.checkClick);
      this.keyboardSelectedIndex = this.fonts.indexOf(this.value);
      this.scrollSelectedItemIntoView();
    },

    checkClick(e) {
      const { fontComponent } = this.$refs;

      if (e.target !== fontComponent && !fontComponent.contains(e.target)) {
        this.hideFontList();
      }
    },

    hideFontList() {
      this.showFontList = false;
      this.$refs.fontComponentInput.blur();
      window.removeEventListener("click", this.checkClick);
    },

    search(textIn, termIn) {
      const text = textIn.toLowerCase().trim();
      const term = termIn.toLowerCase().trim();
      if (termIn.length < 1) {
        return true;
      }

      return text.indexOf(term) > -1;
    },

    selectHighlightedItem() {
      let index = 0;

      if (this.keyboardSelectedIndex > -1) {
        index = this.keyboardSelectedIndex;
      }

      this.setFont(this.fontsToShow[index]);
      this.hideFontList();
    },

    incrementKeyboardIndex() {
      if (this.keyboardSelectedIndex + 1 < this.fontsToShow.length) {
        this.keyboardSelectedIndex += 1;

        this.scrollSelectedItemIntoView();
      }
    },

    decrementKeyboardIndex() {
      if (this.keyboardSelectedIndex - 1 > -1) {
        this.keyboardSelectedIndex -= 1;
        this.scrollSelectedItemIntoView();
      }
    },

    clickItem(font) {
      this.setFont(font);
      this.hideFontList();
    },

    scrollSelectedItemIntoView() {
      this.$nextTick(() => {
        const { fontComponent } = this.$refs;
        const selected = fontComponent.querySelector(".keyboardSelected");

        if (selected) {
          selected.scrollIntoView({ block: "nearest" });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.searchable-select {
  height: 100px;
  overflow-y: scroll;
  padding: 0;

  li {
    list-style: none;
    margin: 0;

    &.selected,
    &:hover {
      background-color: var(--foreground-color-3);
    }
  }
}
</style>
