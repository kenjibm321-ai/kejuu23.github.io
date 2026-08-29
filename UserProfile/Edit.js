(() => {
  "use strict";

  /* =========================================================
     KEJUU — EDIT PROFILE
     Clean / Stable / Responsive
     ========================================================= */

  const STORAGE_KEY = "kejuu.profile.edit.v2";

  /* =========================================================
     DATA
     ========================================================= */

  const DATA = {
    languages: [
      ["Japanese", "🇯🇵"],
      ["English", "🇬🇧"],
      ["German", "🇩🇪"],
      ["Korean", "🇰🇷"],
      ["Chinese", "🇨🇳"],
      ["Spanish", "🇪🇸"],
      ["French", "🇫🇷"],
      ["Italian", "🇮🇹"]
    ],

    levels: [
      "Beginner",
      "Elementary",
      "Intermediate",
      "Upper Intermediate",
      "Advanced"
    ],

    interests: [
      "Anime",
      "Manga",
      "Games",
      "Music",
      "Movies",
      "Travel",
      "Culture",
      "Technology",
      "Programming",
      "History",
      "Art",
      "Literature"
    ],

    goals: [
      ["Conversation", "Improve real-world speaking"],
      ["JLPT", "Japanese proficiency"],
      ["TOEFL", "Academic English"],
      ["IELTS", "Academic & general English"],
      ["Goethe-Zertifikat", "German proficiency"],
      ["TOPIK", "Korean proficiency"],
      ["Study Abroad", "Prepare for studying overseas"],
      ["Travel", "Language for travel"],
      ["Career", "Language for future work"],
      ["Personal Growth", "Learn consistently for yourself"]
    ],

    styles: [
      "Vocabulary",
      "Grammar",
      "Listening",
      "Speaking",
      "Reading",
      "Writing",
      "Flashcards",
      "Quiz"
    ],

    statuses: [
      ["📚", "Learning"],
      ["🎯", "Focusing"],
      ["🔥", "Maintaining streak"],
      ["🌱", "Just starting"],
      ["✨", "Exploring"],
      ["💤", "Taking a break"]
    ],

    countries: [
      "Indonesia",
      "Japan",
      "Germany",
      "United States",
      "South Korea",
      "United Kingdom",
      "Singapore",
      "Australia"
    ],

    cities: {
      Indonesia: [
        "Jakarta",
        "Bandung",
        "Surabaya",
        "Yogyakarta",
        "Semarang",
        "Malang",
        "Medan",
        "Makassar"
      ],

      Japan: [
        "Tokyo",
        "Osaka",
        "Kyoto",
        "Nagoya",
        "Sapporo",
        "Fukuoka"
      ],

      Germany: [
        "Berlin",
        "Munich",
        "Hamburg",
        "Frankfurt",
        "Cologne",
        "Leipzig"
      ],

      "United States": [
        "New York",
        "Los Angeles",
        "Seattle",
        "Boston",
        "Chicago",
        "San Francisco"
      ],

      "South Korea": [
        "Seoul",
        "Busan",
        "Incheon",
        "Daegu",
        "Daejeon"
      ],

      "United Kingdom": [
        "London",
        "Manchester",
        "Liverpool",
        "Birmingham",
        "Edinburgh"
      ],

      Singapore: [
        "Singapore"
      ],

      Australia: [
        "Sydney",
        "Melbourne",
        "Brisbane",
        "Perth",
        "Adelaide"
      ]
    }
  };


  /* =========================================================
     DEFAULT STATE
     ========================================================= */

  const DEFAULT_STATE = {
    displayName: "",
    username: "",
    bio: "",
    avatar: "",

    languages: [
      "Japanese"
    ],

    languageLevels: {
      Japanese: "Beginner"
    },

    interests: [],

    goals: [
      "Conversation"
    ],

    styles: [
      "Vocabulary",
      "Grammar"
    ],

    status: "Learning",

    country: "Indonesia",
    city: "",

    accent: "blue",

    privacy: {
      profilePublic: true,
      showLanguages: true,
      showInterests: true,
      showProgress: true,
      showStreak: true,
      showActivity: true
    }
  };


  /* =========================================================
     GLOBAL STATE
     ========================================================= */

  let state = loadState();

  let root = null;

  let activeTab = "profile";

  let toastTimer = null;


  /* =========================================================
     STORAGE
     ========================================================= */

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }


  function deepMerge(base, extra) {
    if (!extra || typeof extra !== "object") {
      return base;
    }

    Object.entries(extra).forEach(([key, value]) => {

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        base[key] &&
        typeof base[key] === "object" &&
        !Array.isArray(base[key])
      ) {
        base[key] = deepMerge(base[key], value);
      } else {
        base[key] = value;
      }

    });

    return base;
  }


  function loadState() {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "null"
        );

      return deepMerge(
        clone(DEFAULT_STATE),
        saved || {}
      );

    } catch (error) {
      console.warn(
        "[Kejuu] Gagal membaca profile:",
        error
      );

      return clone(DEFAULT_STATE);
    }
  }


  function saveState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );

      return true;

    } catch (error) {

      console.error(
        "[Kejuu] Gagal menyimpan profile:",
        error
      );

      return false;
    }
  }


  /* =========================================================
     UTILITY
     ========================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }


  function getText(selectors, fallback = "") {
    for (const selector of selectors) {

      const element =
        document.querySelector(selector);

      const value =
        element?.textContent?.trim();

      if (value) {
        return value;
      }
    }

    return fallback;
  }


  function getImage(selectors, fallback = "") {
    for (const selector of selectors) {

      const element =
        document.querySelector(selector);

      const value =
        element?.getAttribute("src");

      if (value) {
        return value;
      }
    }

    return fallback;
  }


  function getPageAvatar() {
    return getImage([
      "#topbar-avatar",
      "#sidebar-profile img"
    ]);
  }


  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "");
  }


  function createFallbackAvatar() {

    return (
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
        >

          <defs>

            <linearGradient
              id="g"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >

              <stop
                offset="0"
                stop-color="#60a5fa"
              />

              <stop
                offset="1"
                stop-color="#818cf8"
              />

            </linearGradient>

          </defs>

          <rect
            width="120"
            height="120"
            rx="28"
            fill="url(#g)"
          />

          <circle
            cx="60"
            cy="45"
            r="20"
            fill="white"
            fill-opacity=".92"
          />

          <path
            d="M25 99c5-21 18-32 35-32s30 11 35 32"
            fill="white"
            fill-opacity=".92"
          />

        </svg>

      `)
    );
  }


  /* =========================================================
     ICONS
     ========================================================= */

  function icon(name) {

    const icons = {

      close: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18"/>
          <path d="M6 6l12 12"/>
        </svg>
      `,

      user: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 21a8 8 0 0 1 16 0"/>
        </svg>
      `,

      language: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m4 5 6 7"/>
          <path d="M3 13l5-6 2-3"/>
          <path d="M2 5h9"/>
          <path d="M7 2h1"/>
          <path d="M14 18h7"/>
          <path d="m17.5 12-4.5 10"/>
          <path d="M15 18h6"/>
        </svg>
      `,

      spark: `
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="
            m12 2
            2.2 5.8
            L20 10
            l-5.8 2.2
            L12 18
            l-2.2-5.8
            L4 10
            l5.8-2.2
            Z
          "/>
        </svg>
      `,

      target: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
        >
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="5"/>
          <circle cx="12" cy="12" r="1.5"/>
        </svg>
      `,

      palette: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="
            M12 3
            a9 9 0 1 0 0 18
            h2.2
            a2 2 0 0 0 0-4
            H13
            a2 2 0 0 1 0-4
            h4
            a5 5 0 0 0 0-10
            Z
          "/>

          <circle
            cx="7.5"
            cy="10"
            r=".8"
          />

          <circle
            cx="10"
            cy="6.8"
            r=".8"
          />

          <circle
            cx="14"
            cy="6.8"
            r=".8"
          />

        </svg>
      `,

      shield: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        >

          <path d="
            M12 22
            s8-4 8-10
            V5
            l-8-3
            -8 3
            v7
            c0 6 8 10 8 10Z
          "/>

          <path d="m9 12 2 2 4-4"/>

        </svg>
      `,

      check: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m5 12 4 4L19 6"/>
        </svg>
      `,

      search: `
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <path d="m20 20-4-4"/>

        </svg>
      `

    };

    return icons[name] || "";
  }


  /* =========================================================
     INIT
     ========================================================= */

  function init() {

    if (root) {
      return;
    }


    root =
      document.createElement("div");


    root.className =
      "edit-profile-root";


    root.innerHTML =
      render();


    document.body.appendChild(
      root
    );


    bindEvents();

    hydrateFromPage();
  }


  /* =========================================================
     MAIN RENDER
     ========================================================= */

  function render() {

    const name =
      state.displayName ||
      getText(
        [
          "#topbar-user-name",
          "#sidebar-profile .profile-info h4"
        ],
        "User"
      );


    const avatar =
      state.avatar ||
      getPageAvatar() ||
      createFallbackAvatar();


    return `

      <!-- BACKDROP -->

      <div
        class="edit-profile-backdrop"
        data-edit-close
      ></div>



      <!-- EDITOR -->

      <section
        class="edit-profile"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >


        <!-- HEADER -->

        <header
          class="edit-profile__header"
        >

          <div
            class="edit-profile__header-main"
          >

            <button
              type="button"
              class="edit-profile__icon-btn"
              data-edit-close
              aria-label="Tutup"
            >
              ${icon("close")}
            </button>


            <div>

              <h1
                class="edit-profile__title"
                id="edit-profile-title"
              >
                Edit Profile
              </h1>

              <p
                class="edit-profile__subtitle"
              >
                Sesuaikan profil Kejuu
                sesuai gaya kamu.
              </p>

            </div>

          </div>


          <div
            class="edit-profile__header-actions"
          >

            <button
              type="button"
              class="edit-profile__save"
              data-edit-save
            >
              Simpan
            </button>

          </div>

        </header>



        <!-- LAYOUT -->

        <div class="edit-profile__layout">


          <!-- NAV -->

          <nav
            class="edit-profile__nav"
            aria-label="Kategori profile"
          >

            <div
              class="edit-profile__nav-group"
            >

              <div
                class="edit-profile__nav-label"
              >
                Profile
              </div>

              ${tab(
                "profile",
                "Profile",
                "user"
              )}

              ${tab(
                "learning",
                "Learning",
                "language"
              )}

              ${tab(
                "interests",
                "Interests",
                "spark"
              )}

            </div>


            <div
              class="edit-profile__nav-group"
            >

              <div
                class="edit-profile__nav-label"
              >
                Preferences
              </div>

              ${tab(
                "goals",
                "Goals",
                "target"
              )}

              ${tab(
                "appearance",
                "Appearance",
                "palette"
              )}

              ${tab(
                "privacy",
                "Privacy",
                "shield"
              )}

            </div>

          </nav>



          <!-- CONTENT -->

          <main
            class="edit-profile__content"
          >

            ${sectionProfile(
              name,
              avatar
            )}

            ${sectionLearning()}

            ${sectionInterests()}

            ${sectionGoals()}

            ${sectionAppearance()}

            ${sectionPrivacy()}

          </main>

        </div>



        <!-- FOOTER -->

        <footer
          class="edit-profile__footer"
        >

          <p
            class="edit-profile__footer-note"
          >
            Perubahan tersimpan
            di perangkat ini.
          </p>


          <div
            class="edit-profile__footer-actions"
          >

            <button
              type="button"
              class="edit-profile__footer-btn"
              data-edit-reset
            >
              Reset
            </button>


            <button
              type="button"
              class="edit-profile__footer-btn edit-profile__footer-btn--primary"
              data-edit-save
            >
              Simpan
            </button>

          </div>

        </footer>



        <!-- TOAST -->

        <div
          class="edit-profile__toast"
          data-edit-toast
          aria-live="polite"
        ></div>


      </section>
    `;
  }


  /* =========================================================
     TAB BUTTON
     ========================================================= */

  function tab(
    id,
    label,
    iconName
  ) {

    return `

      <button
        type="button"
        class="edit-profile__tab ${
          activeTab === id
            ? "is-active"
            : ""
        }"
        data-edit-tab="${id}"
        aria-selected="${
          activeTab === id
        }"
      >

        ${icon(iconName)}

        <span>
          ${escapeHTML(label)}
        </span>

      </button>
    `;
  }


  /* =========================================================
     PROFILE SECTION
     ========================================================= */

  function sectionProfile(
    name,
    avatar
  ) {

    return `

      <section
        class="edit-profile__section ${
          activeTab === "profile"
            ? "is-active"
            : ""
        }"
        data-edit-section="profile"
      >


        <div
          class="edit-profile__section-head"
        >

          <h2>
            Profile
          </h2>

          <p>
            Atur informasi yang ingin
            ditampilkan pada profile publik.
          </p>

        </div>



        <!-- AVATAR -->

        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__avatar"
          >

            <div
              class="edit-profile__avatar-preview"
            >

              <img
                data-avatar-preview
                src="${escapeHTML(avatar)}"
                alt="Foto profile ${escapeHTML(name)}"
              />

            </div>


            <div>

              <div
                class="edit-profile__card-title"
              >
                Foto profil
              </div>

              <div
                class="edit-profile__helper"
              >
                sesuaikan profil favorit kalian.
              </div>


              <div
                class="edit-profile__avatar-actions"
                style="margin-top:.65rem;"
              >

                <button
                  type="button"
                  class="edit-profile__mini-btn"
                  data-avatar-upload
                >
                  Pilih foto
                </button>


                <button
                  type="button"
                  class="edit-profile__mini-btn edit-profile__mini-btn--danger"
                  data-avatar-remove
                >
                  Hapus
                </button>


                <input
                  type="file"
                  accept="image/*"
                  data-avatar-input
                  hidden
                />

              </div>

            </div>

          </div>

        </div>



        <!-- BASIC INFO -->

        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__grid"
          >


            <label
              class="edit-profile__field"
            >

              <span
                class="edit-profile__label"
              >
                Nama tampilan
              </span>

              <input
                class="edit-profile__input"
                type="text"
                maxlength="40"                autocomplete="nickname"
                data-field="displayName"
                value="${escapeHTML(
                  state.displayName || name
                )}"
                placeholder="Nama tampilan"
              />

            </label>


            <label
              class="edit-profile__field"
            >

              <span
                class="edit-profile__label"
              >
                Username
              </span>

              <input
                class="edit-profile__input"
                type="text"
                maxlength="24"
                autocomplete="username"
                data-field="username"
                value="${escapeHTML(
                  state.username
                )}"
                placeholder="@username"
              />

            </label>


            <label
              class="edit-profile__field edit-profile__field--full"
            >

              <span
                class="edit-profile__label"
              >
                Bio
              </span>

              <textarea
                class="edit-profile__textarea"
                maxlength="160"
                data-field="bio"
                placeholder="Ceritakan sedikit tentang dirimu..."
              >${escapeHTML(
                state.bio
              )}</textarea>

              <span
                class="edit-profile__helper"
                data-bio-counter
              >
                ${state.bio.length}/160
              </span>

            </label>

          </div>

        </div>


        <!-- STATUS -->

        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__card-title"
          >
            Status
          </div>

          <div
            class="edit-profile__chips"
          >

            ${renderStatusChips()}

          </div>

        </div>


      </section>
    `;
  }


  function renderStatusChips() {

    return DATA.statuses
      .map(([emoji, label]) => `

        <label
          class="edit-profile__chip ${
            state.status === label
              ? "is-selected"
              : ""
          }"
        >

          <input
            type="radio"
            name="edit-status"
            value="${escapeHTML(label)}"
            ${
              state.status === label
                ? "checked"
                : ""
            }
            data-status
          />

          <span>
            ${emoji}
          </span>

          <span>
            ${escapeHTML(label)}
          </span>

        </label>

      `)
      .join("");
  }


  /* =========================================================
     LEARNING SECTION
     ========================================================= */

  function sectionLearning() {

    const selected =
      new Set(
        state.languages
      );

    return `

      <section
        class="edit-profile__section ${
          activeTab === "learning"
            ? "is-active"
            : ""
        }"
        data-edit-section="learning"
      >

        <div
          class="edit-profile__section-head"
        >

          <h2>
            Learning Profile
          </h2>

          <p>
            Pilih bahasa yang sedang kamu
            pelajari dan level masing-masing.
          </p>

        </div>


        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__chips-meta"
          >

            <h3
              class="edit-profile__card-title"
              style="margin:0;"
            >
              Bahasa yang dipelajari
            </h3>

            <span
              class="edit-profile__counter"
              data-language-counter
            >
              ${state.languages.length}
              dipilih
            </span>

          </div>


          <div
            class="edit-profile__chips"
          >

            ${DATA.languages
              .map(
                ([label, emoji]) => `

                  <label
                    class="edit-profile__chip ${
                      selected.has(label)
                        ? "is-selected"
                        : ""
                    }"
                  >

                    <input
                      type="checkbox"
                      value="${escapeHTML(label)}"
                      data-language
                      ${
                        selected.has(label)
                          ? "checked"
                          : ""
                      }
                    />

                    <span>
                      ${emoji}
                    </span>

                    <span>
                      ${escapeHTML(label)}
                    </span>

                  </label>

                `
              )
              .join("")}

          </div>

        </div>


        <div
          class="edit-profile__card"
        >

          <h3
            class="edit-profile__card-title"
          >
            Level bahasa
          </h3>

          <div
            class="edit-profile__option-list"
          >

            ${
              state.languages.length
                ? state.languages
                    .map(
                      language => `

                        <div
                          class="edit-profile__option"
                        >

                          <div
                            class="edit-profile__option-main"
                          >

                            <div>

                              <div
                                class="edit-profile__option-title"
                              >
                                ${escapeHTML(language)}
                              </div>

                              <div
                                class="edit-profile__option-sub"
                              >
                                Level saat ini
                              </div>

                            </div>

                          </div>

                          <select
                            class="edit-profile__select"
                            data-language-level="${escapeHTML(
                              language
                            )}"
                          >

                            ${DATA.levels
                              .map(
                                level => `

                                  <option
                                    value="${escapeHTML(
                                      level
                                    )}"
                                    ${
                                      state.languageLevels[
                                        language
                                      ] === level
                                        ? "selected"
                                        : ""
                                    }
                                  >
                                    ${escapeHTML(
                                      level
                                    )}
                                  </option>

                                `
                              )
                              .join("")}

                          </select>

                        </div>

                      `
                    )
                    .join("")
                : `
                    <div
                      class="edit-profile__helper"
                    >
                      Pilih minimal satu bahasa.
                    </div>
                  `
            }

          </div>

        </div>


        <div
          class="edit-profile__card"
        >

          <h3
            class="edit-profile__card-title"
          >
            Gaya belajar
          </h3>

          <div
            class="edit-profile__chips"
          >

            ${renderSimpleChips(
              DATA.styles,
              state.styles,
              "style"
            )}

          </div>

        </div>

      </section>
    `;
  }
  
    /* =========================================================
     INTERESTS SECTION
     ========================================================= */

  function sectionInterests() {

    return `

      <section
        class="edit-profile__section ${
          activeTab === "interests"
            ? "is-active"
            : ""
        }"
        data-edit-section="interests"
      >

        <div
          class="edit-profile__section-head"
        >

          <h2>
            Interests
          </h2>

          <p>
            Pilih topik yang paling
            menggambarkan minat kamu.
          </p>

        </div>


        <!-- INTERESTS -->

        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__chips-meta"
          >

            <h3
              class="edit-profile__card-title"
              style="margin:0;"
            >
              Minat
            </h3>

            <span
              class="edit-profile__counter"
              data-interest-counter
            >
              ${state.interests.length}
              dipilih
            </span>

          </div>


          <div
            class="edit-profile__chips"
          >

            ${renderSimpleChips(
              DATA.interests,
              state.interests,
              "interest"
            )}

          </div>

        </div>


        <!-- LOCATION -->

        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__chips-meta"
          >

            <h3
              class="edit-profile__card-title"
              style="margin:0;"
            >
              Lokasi
            </h3>

            <span
              class="edit-profile__helper"
            >
              Opsional
            </span>

          </div>


          <div
            class="edit-profile__select-row"
          >

            <select
              class="edit-profile__select"
              data-location-country
            >

              <option value="">
                Pilih negara
              </option>

              ${DATA.countries
                .map(
                  country => `

                    <option
                      value="${escapeHTML(
                        country
                      )}"
                      ${
                        state.country === country
                          ? "selected"
                          : ""
                      }
                    >
                      ${escapeHTML(
                        country
                      )}
                    </option>

                  `
                )
                .join("")}

            </select>


            <select
              class="edit-profile__select"
              data-location-city
            >

              <option value="">
                Pilih kota
              </option>

              ${renderCityOptions()}

            </select>

          </div>

        </div>

      </section>
    `;
  }


  /* =========================================================
     CITY OPTIONS
     ========================================================= */

  function renderCityOptions() {

    const cities =
      DATA.cities[
        state.country
      ] || [];


    return cities
      .map(
        city => `

          <option
            value="${escapeHTML(city)}"
            ${
              state.city === city
                ? "selected"
                : ""
            }
          >
            ${escapeHTML(city)}
          </option>

        `
      )
      .join("");
  }


  /* =========================================================
     SIMPLE CHIPS
     ========================================================= */

  function renderSimpleChips(
    items,
    selectedValues,
    type
  ) {

    const selected =
      new Set(
        selectedValues
      );


    return items
      .map(
        item => `

          <label
            class="edit-profile__chip ${
              selected.has(item)
                ? "is-selected"
                : ""
            }"
          >

            <input
              type="checkbox"
              value="${escapeHTML(item)}"
              data-${type}
              ${
                selected.has(item)
                  ? "checked"
                  : ""
              }
            />

            <span>
              ${escapeHTML(item)}
            </span>

          </label>

        `
      )
      .join("");
  }


  /* =========================================================
     GOALS SECTION
     ========================================================= */

  function sectionGoals() {

    return `

      <section
        class="edit-profile__section ${
          activeTab === "goals"
            ? "is-active"
            : ""
        }"
        data-edit-section="goals"
      >

        <div
          class="edit-profile__section-head"
        >

          <h2>
            Goals
          </h2>

          <p>
            Pilih target belajar yang
            sedang kamu kejar.
          </p>

        </div>


        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__goal-grid"
          >

            ${DATA.goals
              .map(
                ([title, description]) => `

                  <button
                    type="button"
                    class="edit-profile__goal ${
                      state.goals.includes(
                        title
                      )
                        ? "is-selected"
                        : ""
                    }"
                    data-goal="${escapeHTML(
                      title
                    )}"
                  >

                    <strong>
                      ${escapeHTML(
                        title
                      )}
                    </strong>

                    <span>
                      ${escapeHTML(
                        description
                      )}
                    </span>

                  </button>

                `
              )
              .join("")}

          </div>

        </div>

      </section>
    `;
  }


  /* =========================================================
     APPEARANCE SECTION
     ========================================================= */

  function sectionAppearance() {

    const accents = [

      [
        "blue",
        "❄️",
        "Ice"
      ],

      [
        "violet",
        "🌌",
        "Cosmic"
      ],

      [
        "rose",
        "🌸",
        "Sakura"
      ],

      [
        "green",
        "🌿",
        "Nature"
      ]

    ];


    return `

      <section
        class="edit-profile__section ${
          activeTab === "appearance"
            ? "is-active"
            : ""
        }"
        data-edit-section="appearance"
      >

        <div
          class="edit-profile__section-head"
        >

          <h2>
            Appearance
          </h2>

          <p>
            Pilih aksen visual
            untuk profile kamu.
          </p>

        </div>


        <div
          class="edit-profile__card"
        >

          <h3
            class="edit-profile__card-title"
          >
            Profile accent
          </h3>


          <div
            class="edit-profile__chips"
          >

            ${accents
              .map(
                ([value, emoji, label]) => `

                  <label
                    class="edit-profile__chip ${
                      state.accent === value
                        ? "is-selected"
                        : ""
                    }"
                  >

                    <input
                      type="radio"
                      name="edit-accent"
                      value="${escapeHTML(
                        value
                      )}"
                      data-accent
                      ${
                        state.accent === value
                          ? "checked"
                          : ""
                      }
                    />

                    <span>
                      ${emoji}
                    </span>

                    <span>
                      ${escapeHTML(
                        label
                      )}
                    </span>

                  </label>

                `
              )
              .join("")}

          </div>

        </div>

      </section>
    `;
  }


  /* =========================================================
     PRIVACY SECTION
     ========================================================= */

  function sectionPrivacy() {

    const items = [

      [
        "profilePublic",
        "Profile public",
        "Profile dapat ditemukan pengguna lain."
      ],

      [
        "showLanguages",
        "Tampilkan bahasa",
        "Tampilkan bahasa yang sedang dipelajari."
      ],

      [
        "showInterests",
        "Tampilkan interests",
        "Tampilkan chip minat di profile."
      ],

      [
        "showProgress",
        "Tampilkan progress",
        "Tampilkan ringkasan progress belajar."
      ],

      [
        "showStreak",
        "Tampilkan streak",
        "Tampilkan streak belajar."
      ],

      [
        "showActivity",
        "Tampilkan activity status",
        "Tampilkan status aktivitas."
      ]

    ];


    return `

      <section
        class="edit-profile__section ${
          activeTab === "privacy"
            ? "is-active"
            : ""
        }"
        data-edit-section="privacy"
      >

        <div
          class="edit-profile__section-head"
        >

          <h2>
            Privacy
          </h2>

          <p>
            Atur informasi yang
            boleh terlihat oleh orang lain.
          </p>

        </div>


        <div
          class="edit-profile__card"
        >

          <div
            class="edit-profile__privacy-list"
          >

            ${items
              .map(
                ([key, title, description]) => `

                  <label
                    class="edit-profile__privacy-item"
                  >

                    <span
                      class="edit-profile__privacy-copy"
                    >

                      <strong>
                        ${escapeHTML(
                          title
                        )}
                      </strong>

                      <span>
                        ${escapeHTML(
                          description
                        )}
                      </span>

                    </span>


                    <span
                      class="edit-profile__switch"
                    >

                      <input
                        type="checkbox"
                        data-privacy="${escapeHTML(
                          key
                        )}"
                        ${
                          state.privacy[
                            key
                          ]
                            ? "checked"
                            : ""
                        }
                      />

                      <span
                        class="edit-profile__switch-track"
                      >

                        <span
                          class="edit-profile__switch-thumb"
                        ></span>

                      </span>

                    </span>

                  </label>

                `
              )
              .join("")}

          </div>

        </div>

      </section>
    `;
  }


  /* =========================================================
     EVENTS
     ========================================================= */

  function bindEvents() {

    root.addEventListener(
      "click",
      event => {

        const tabButton =
          event.target.closest(
            "[data-edit-tab]"
          );


        if (tabButton) {

          activeTab =
            tabButton.dataset.editTab;

          updateActiveUI();

          return;
        }


        const goalButton =
          event.target.closest(
            "[data-goal]"
          );


        if (goalButton) {

          toggleGoal(
            goalButton.dataset.goal
          );

          return;
        }


        if (
          event.target.closest(
            "[data-edit-save]"
          )
        ) {

          collect();


          if (saveState()) {

            updatePageProfile();

            showToast(
              "Profil berhasil disimpan."
            );

          } else {

            showToast(
              "Gagal menyimpan perubahan."
            );

          }

          return;
        }


        if (
          event.target.closest(
            "[data-edit-reset]"
          )
        ) {

          state =
            clone(
              DEFAULT_STATE
            );

          refresh();

          showToast(
            "Profil dikembalikan ke default."
          );

          return;
        }


        if (
          event.target.closest(
            "[data-avatar-upload]"
          )
        ) {

          root
            .querySelector(
              "[data-avatar-input]"
            )
            ?.click();

          return;
        }


        if (
          event.target.closest(
            "[data-avatar-remove]"
          )
        ) {

          state.avatar = "";

          syncAvatar(
            getPageAvatar() ||
            createFallbackAvatar()
          );

          return;
        }


        const closeTarget =
          event.target.closest(
            "[data-edit-close]"
          );


        if (
          closeTarget &&
          (
            closeTarget.classList.contains(
              "edit-profile-backdrop"
            ) ||
            closeTarget.classList.contains(
              "edit-profile__icon-btn"
            )
          )
        ) {

          event.preventDefault();

          close();

        }

      }
    );


    root.addEventListener(
      "change",
      event => {

        const element =
          event.target;


        if (
          element.matches(
            "[data-avatar-input]"
          )
        ) {

          handleAvatarUpload(
            element.files?.[0]
          );

          return;
        }


        if (
          element.matches(
            "[data-language]"
          )
        ) {

          toggleLanguage(
            element.value,
            element.checked
          );

          return;
        }


        if (
          element.matches(
            "[data-language-level]"
          )
        ) {

          state.languageLevels[
            element.dataset.languageLevel
          ] = element.value;

          return;
        }


        if (
          element.matches(
            "[data-interest]"
          )
        ) {

          toggleArrayValue(
            "interests",
            element.value,
            element.checked
          );


          updateSelectionVisual(
            element
          );


          updateCounter(
            "[data-interest-counter]",
            state.interests.length
          );

          return;
        }


        if (
          element.matches(
            "[data-style]"
          )
        ) {

          toggleArrayValue(
            "styles",
            element.value,
            element.checked
          );


          updateSelectionVisual(
            element
          );

          return;
        }


        if (
          element.matches(
            "[data-status]"
          )
        ) {

          state.status =
            element.value;


          root
            .querySelectorAll(
              "[data-status]"
            )
            .forEach(input => {

              input
                .closest(
                  ".edit-profile__chip"
                )
                ?.classList.toggle(
                  "is-selected",
                  input.checked
                );

            });


          return;
        }


        if (
          element.matches(
            "[data-accent]"
          )
        ) {

          state.accent =
            element.value;


          root
            .querySelectorAll(
              "[data-accent]"
            )
            .forEach(input => {

              input
                .closest(
                  ".edit-profile__chip"
                )
                ?.classList.toggle(
                  "is-selected",
                  input.checked
                );

            });


          return;
        }


        if (
          element.matches(
            "[data-location-country]"
          )
        ) {

          state.country =
            element.value;

          state.city =
            "";


          const citySelect =
            root.querySelector(
              "[data-location-city]"
            );


          if (citySelect) {

            citySelect.innerHTML = `

              <option value="">
                Pilih kota
              </option>

              ${renderCityOptions()}

            `;

          }


          return;
        }


        if (
          element.matches(
            "[data-location-city]"
          )
        ) {

          state.city =
            element.value;

          return;
        }


        if (
          element.matches(
            "[data-privacy]"
          )
        ) {

          state.privacy[
            element.dataset.privacy
          ] = element.checked;

        }

      }
    );


    root.addEventListener(
      "input",
      event => {

        const element =
          event.target;


        if (
          element.matches(
            '[data-field="displayName"]'
          )
        ) {

          state.displayName =
            element.value;

        }


        if (
          element.matches(
            '[data-field="username"]'
          )
        ) {

          element.value =
            element.value
              .replace(/\s+/g, "");


          state.username =
            element.value;

        }


        if (
          element.matches(
            '[data-field="bio"]'
          )
        ) {

          state.bio =
            element.value;


          updateCounter(
            "[data-bio-counter]",
            state.bio.length,
            160
          );

        }

      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          !root ||
          !root.classList.contains(
            "is-open"
          )
        ) {
          return;
        }


        if (
          event.key === "Escape"
        ) {

          close();

          return;
        }


        if (
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() === "s"
        ) {

          event.preventDefault();

          collect();


          if (saveState()) {

            updatePageProfile();

            showToast(
              "Profil berhasil disimpan."
            );

          }

        }

      }
    );

  }


  /* =========================================================
     SELECTION VISUAL
     ========================================================= */

  function updateSelectionVisual(
    input
  ) {

    const chip =
      input.closest(
        ".edit-profile__chip"
      );


    if (!chip) {
      return;
    }


    chip.classList.toggle(
      "is-selected",
      input.checked
    );
  }


  function updateCounter(
    selector,
    value,
    max = null
  ) {

    const element =
      root?.querySelector(
        selector
      );


    if (!element) {
      return;
    }


    element.textContent =
      max !== null
        ? `${value}/${max}`
        : `${value} dipilih`;
  }
/* =========================================================
   ARRAY HELPERS
   ========================================================= */

function toggleArrayValue(
  property,
  value,
  checked
) {

  if (!Array.isArray(state[property])) {
    state[property] = [];
  }

  if (checked) {

    if (!state[property].includes(value)) {
      state[property].push(value);
    }

  } else {

    state[property] =
      state[property].filter(
        item => item !== value
      );

  }

}


/* =========================================================
   LANGUAGE HANDLER
   ========================================================= */

function toggleLanguage(
  language,
  checked
) {

  toggleArrayValue(
    "languages",
    language,
    checked
  );


  if (checked) {

    if (!state.languageLevels[language]) {

      state.languageLevels[language] =
        "Beginner";

    }

  } else {

    delete state.languageLevels[language];

  }


  refreshSection("learning");

}


/* =========================================================
   GOAL HANDLER
   ========================================================= */

function toggleGoal(
  goal
) {

  if (
    state.goals.includes(goal)
  ) {

    state.goals =
      state.goals.filter(
        item => item !== goal
      );

  } else {

    state.goals.push(goal);

  }


  refreshSection("goals");

}


/* =========================================================
   AVATAR UPLOAD
   ========================================================= */

function handleAvatarUpload(
  file
) {

  if (!file) {
    return;
  }


  if (
    !file.type ||
    !file.type.startsWith("image/")
  ) {

    showToast(
      "File harus berupa gambar."
    );

    return;

  }


  const MAX_SIZE =
    2 * 1024 * 1024;


  if (file.size > MAX_SIZE) {

    showToast(
      "Ukuran foto maksimal 2 MB."
    );

    return;

  }


  const reader =
    new FileReader();


  reader.onload = event => {

    state.avatar =
      String(
        event.target.result
      );


    syncAvatar(
      state.avatar
    );


    showToast(
      "Foto profil diperbarui."
    );

  };


  reader.onerror = () => {

    showToast(
      "Foto gagal dibaca."
    );

  };


  reader.readAsDataURL(file);

}


/* =========================================================
   AVATAR PREVIEW
   ========================================================= */

function syncAvatar(
  source
) {

  if (!root) {
    return;
  }


  const preview =
    root.querySelector(
      "[data-avatar-preview]"
    );


  if (!preview) {
    return;
  }


  preview.src =
    source ||
    getPageAvatar() ||
    createFallbackAvatar();


  preview.onerror = () => {

    preview.onerror = null;

    preview.src =
      createFallbackAvatar();

  };

}


/* =========================================================
   COLLECT FORM DATA
   ========================================================= */

function collect() {

  const displayNameInput =
    root.querySelector(
      '[data-field="displayName"]'
    );


  const usernameInput =
    root.querySelector(
      '[data-field="username"]'
    );


  const bioInput =
    root.querySelector(
      '[data-field="bio"]'
    );


  if (displayNameInput) {

    state.displayName =
      displayNameInput.value.trim();

  }


  if (usernameInput) {

    state.username =
      usernameInput.value
        .trim()
        .replace(/^@+/, "");

  }


  if (bioInput) {

    state.bio =
      bioInput.value.trim();

  }


  root
    .querySelectorAll(
      "[data-language]"
    )
    .forEach(input => {

      const language =
        input.value;


      if (input.checked) {

        if (
          !state.languages.includes(
            language
          )
        ) {

          state.languages.push(
            language
          );

        }

      } else {

        state.languages =
          state.languages.filter(
            item =>
              item !== language
          );

      }

    });


  root
    .querySelectorAll(
      "[data-language-level]"
    )
    .forEach(select => {

      const language =
        select.dataset.languageLevel;


      state.languageLevels[
        language
      ] =
        select.value;

    });


  root
    .querySelectorAll(
      "[data-interest]"
    )
    .forEach(input => {

      if (input.checked) {

        if (
          !state.interests.includes(
            input.value
          )
        ) {

          state.interests.push(
            input.value
          );

        }

      } else {

        state.interests =
          state.interests.filter(
            item =>
              item !== input.value
          );

      }

    });


  root
    .querySelectorAll(
      "[data-style]"
    )
    .forEach(input => {

      if (input.checked) {

        if (
          !state.styles.includes(
            input.value
          )
        ) {

          state.styles.push(
            input.value
          );

        }

      } else {

        state.styles =
          state.styles.filter(
            item =>
              item !== input.value
          );

      }

    });


  const statusInput =
    root.querySelector(
      "[data-status]:checked"
    );


  if (statusInput) {

    state.status =
      statusInput.value;

  }


  const accentInput =
    root.querySelector(
      "[data-accent]:checked"
    );


  if (accentInput) {

    state.accent =
      accentInput.value;

  }


  const countrySelect =
    root.querySelector(
      "[data-location-country]"
    );


  const citySelect =
    root.querySelector(
      "[data-location-city]"
    );


  if (countrySelect) {

    state.country =
      countrySelect.value;

  }


  if (citySelect) {

    state.city =
      citySelect.value;

  }


  root
    .querySelectorAll(
      "[data-privacy]"
    )
    .forEach(input => {

      state.privacy[
        input.dataset.privacy
      ] =
        input.checked;

    });

}


/* =========================================================
   SAVE STATE
   ========================================================= */

function saveState() {

  try {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );


    return true;

  } catch (error) {

    console.error(
      "Kejuu Edit Profile:",
      error
    );


    showToast(
      "Perubahan gagal disimpan."
    );


    return false;

  }

}


/* =========================================================
   UPDATE MAIN PROFILE
   ========================================================= */

function updatePageProfile() {

  const displayName =
    state.displayName ||
    "User";


  const username =
    state.username
      ? `@${state.username}`
      : "";


  const avatar =
    state.avatar ||
    getPageAvatar() ||
    createFallbackAvatar();


  const nameSelectors = [

    "#topbar-user-name",

    "#sidebar-profile .profile-info h4",

    "[data-profile-name]",

    "[data-user-name]"

  ];


  nameSelectors.forEach(
    selector => {

      document
        .querySelectorAll(selector)
        .forEach(element => {

          element.textContent =
            displayName;

        });

    }
  );


  document
    .querySelectorAll(
      "[data-profile-username]"
    )
    .forEach(element => {

      element.textContent =
        username;

    });


  document
    .querySelectorAll(
      "#topbar-avatar, #sidebar-profile img, [data-profile-avatar]"
    )
    .forEach(element => {

      element.src =
        avatar;

      element.alt =
        displayName;

    });


  document.dispatchEvent(
    new CustomEvent(
      "kejuu:profile-updated",
      {
        detail: clone(state)
      }
    )
  );

}


/* =========================================================
   REFRESH FULL EDIT PROFILE
   ========================================================= */

function refresh() {

  if (!root) {
    return;
  }


  root.innerHTML =
    render();


  syncAvatar(
    state.avatar ||
    getPageAvatar() ||
    createFallbackAvatar()
  );


  updateActiveUI();

}


/* =========================================================
   REFRESH SINGLE SECTION
   ========================================================= */

function refreshSection(
  sectionId
) {

  if (!root) {
    return;
  }


  const content =
    root.querySelector(
      ".edit-profile__content"
    );


  if (!content) {
    return;
  }


  const displayName =
    state.displayName ||
    getText(
      [
        "#topbar-user-name",
        "#sidebar-profile .profile-info h4"
      ],
      "User"
    );


  const avatar =
    state.avatar ||
    getPageAvatar() ||
    createFallbackAvatar();


  content.innerHTML = `

    ${sectionProfile(
      displayName,
      avatar
    )}

    ${sectionLearning()}

    ${sectionInterests()}

    ${sectionGoals()}

    ${sectionAppearance()}

    ${sectionPrivacy()}

  `;


  activeTab =
    sectionId;


  syncAvatar(
    avatar
  );
  updateActiveUI();
}

/* =========================================================
   UPDATE ACTIVE TAB
   ========================================================= */

function updateActiveUI() {

  if (!root) {
    return;
  }


  root
    .querySelectorAll(
      "[data-edit-tab]"
    )
    .forEach(button => {

      const isActive =
        button.dataset.editTab ===
        activeTab;


      button.classList.toggle(
        "is-active",
        isActive
      );


      button.setAttribute(
        "aria-selected",
        String(isActive)
      );

    });


  root
    .querySelectorAll(
      "[data-edit-section]"
    )
    .forEach(section => {

      const isActive =
        section.dataset.editSection ===
        activeTab;


      section.classList.toggle(
        "is-active",
        isActive
      );

    });

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  const toast =
    root?.querySelector(
      "[data-edit-toast]"
    );


  if (!toast) {
    return;
  }


  toast.textContent =
    message;


  toast.classList.add(
    "is-show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "is-show"
        );

      },
      2200
    );

}


/* =========================================================
   HYDRATE PAGE DATA
   ========================================================= */

function hydrateFromPage() {

  const pageName =
    getText(
      [
        "#topbar-user-name",
        "#sidebar-profile .profile-info h4",
        "[data-profile-name]"
      ]
    );


  if (
    !state.displayName &&
    pageName
  ) {

    state.displayName =
      pageName;

  }


  const pageAvatar =
    getPageAvatar();


  if (
    !state.avatar &&
    pageAvatar
  ) {

    syncAvatar(
      pageAvatar
    );

  }

}


/* =========================================================
   OPEN EDIT PROFILE
   ========================================================= */

function open() {

  init();


  if (!root) {
    return;
  }


  root.classList.add(
    "is-open"
  );


  root.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.classList.add(
    "edit-profile-open"
  );


  updateActiveUI();


  requestAnimationFrame(
    () => {

      const closeButton =
        root.querySelector(
          "[data-edit-close]"
        );


      if (closeButton) {

        closeButton.focus();

      }

    }
  );

}


/* =========================================================
   CLOSE EDIT PROFILE
   ========================================================= */

function close() {

  if (!root) {
    return;
  }


  root.classList.remove(
    "is-open"
  );


  root.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "edit-profile-open"
  );

}


/* =========================================================
   PROFILE EDIT TRIGGER
   ========================================================= */

document.addEventListener(
  "click",
  event => {

    const editButton =
      event.target.closest(
        '[data-profile-action="edit"]'
      );


    if (!editButton) {
      return;
    }


    event.preventDefault();

    event.stopPropagation();


    if (
      window.ProfileSheet &&
      typeof window.ProfileSheet.close ===
        "function"
    ) {

      window.ProfileSheet.close();

    }


    open();

  },
  true
);


/* =========================================================
   PUBLIC API
   ========================================================= */

window.KejuuEditProfile = {

  init: init,

  open: open,

  close: close,


  save() {

    collect();


    const success =
      saveState();


    if (success) {

      updatePageProfile();


      showToast(
        "Profil berhasil disimpan."
      );

    }


    return success;

  },


  reset() {

    state =
      clone(
        DEFAULT_STATE
      );


    refresh();


    showToast(
      "Profil dikembalikan ke default."
    );

  },


  getState() {

    return clone(
      state
    );

  }

};


/* =========================================================
   AUTO INIT
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      init();

    },
    {
      once: true
    }
  );

} else {

  init();

}


/* =========================================================
   END
   ========================================================= */

})();