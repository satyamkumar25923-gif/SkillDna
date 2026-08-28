(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$profile$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/user-profile-context.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$user$2d$profile$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserProfileProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/tooltip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip,
    "TooltipContent",
    ()=>TooltipContent,
    "TooltipProvider",
    ()=>TooltipProvider,
    "TooltipTrigger",
    ()=>TooltipTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tooltip/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const TooltipProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"];
const Tooltip = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const TooltipTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const TooltipContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, sideOffset = 4, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        ref: ref,
        sideOffset: sideOffset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/tooltip.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = TooltipContent;
TooltipContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "TooltipContent$React.forwardRef");
__turbopack_context__.k.register(_c1, "TooltipContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/user-profile-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserProfileProvider",
    ()=>UserProfileProvider,
    "computeInitials",
    ()=>computeInitials,
    "useUserProfile",
    ()=>useUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
function computeInitials(name) {
    if (!name || !name.trim()) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
const defaultProfile = {
    personal: {
        fullName: "",
        email: "",
        bio: "",
        location: "",
        phone: ""
    },
    profilePhoto: {
        url: null,
        initials: "U"
    },
    career: {
        targetRole: "",
        experienceLevel: "",
        preferredIndustries: [],
        workPreference: []
    },
    social: {
        github: "",
        linkedin: "",
        twitter: "",
        website: ""
    },
    isOnboardingComplete: false
};
const UserProfileContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function UserProfileProvider({ children }) {
    _s();
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultProfile);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserProfileProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const saved = localStorage.getItem("skilldna-user-profile");
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        setProfile({
                            "UserProfileProvider.useEffect": (prev)=>({
                                    ...defaultProfile,
                                    ...parsed,
                                    personal: {
                                        ...defaultProfile.personal,
                                        ...parsed.personal || {}
                                    },
                                    profilePhoto: {
                                        ...defaultProfile.profilePhoto,
                                        ...parsed.profilePhoto || {},
                                        initials: computeInitials(parsed.personal?.fullName || "")
                                    },
                                    career: {
                                        ...defaultProfile.career,
                                        ...parsed.career || {},
                                        preferredIndustries: parsed.career?.preferredIndustries || [],
                                        workPreference: parsed.career?.workPreference || []
                                    },
                                    social: {
                                        ...defaultProfile.social,
                                        ...parsed.social || {}
                                    }
                                })
                        }["UserProfileProvider.useEffect"]);
                    } catch  {
                    // ignore parse errors
                    }
                }
                setIsLoaded(true);
            }
        }
    }["UserProfileProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserProfileProvider.useEffect": ()=>{
            if (isLoaded && ("TURBOPACK compile-time value", "object") !== "undefined") {
                localStorage.setItem("skilldna-user-profile", JSON.stringify(profile));
            }
        }
    }["UserProfileProvider.useEffect"], [
        profile,
        isLoaded
    ]);
    const updatePersonal = (data)=>{
        setProfile((prev)=>{
            const updatedPersonal = {
                ...prev.personal,
                ...data
            };
            const newInitials = computeInitials(updatedPersonal.fullName);
            return {
                ...prev,
                personal: updatedPersonal,
                profilePhoto: {
                    ...prev.profilePhoto,
                    initials: newInitials
                }
            };
        });
    };
    const updateProfilePhoto = (url)=>{
        setProfile((prev)=>({
                ...prev,
                profilePhoto: {
                    ...prev.profilePhoto,
                    url
                }
            }));
    };
    const removeProfilePhoto = ()=>{
        setProfile((prev)=>({
                ...prev,
                profilePhoto: {
                    ...prev.profilePhoto,
                    url: null
                }
            }));
    };
    const updateCareer = (data)=>{
        setProfile((prev)=>({
                ...prev,
                career: {
                    ...prev.career,
                    ...data
                }
            }));
    };
    const updateSocial = (data)=>{
        setProfile((prev)=>({
                ...prev,
                social: {
                    ...prev.social,
                    ...data
                }
            }));
    };
    const completeOnboarding = ()=>{
        setProfile((prev)=>({
                ...prev,
                isOnboardingComplete: true
            }));
    };
    const resetProfile = ()=>{
        setProfile(defaultProfile);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem("skilldna-user-profile");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserProfileContext.Provider, {
        value: {
            profile,
            updatePersonal,
            updateProfilePhoto,
            removeProfilePhoto,
            updateCareer,
            updateSocial,
            completeOnboarding,
            resetProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/user-profile-context.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_s(UserProfileProvider, "D1fdPC9+tlyjtahYRfGv6qltomc=");
_c = UserProfileProvider;
function useUserProfile() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(UserProfileContext);
    if (!context) {
        throw new Error("useUserProfile must be used within a UserProfileProvider");
    }
    return context;
}
_s1(useUserProfile, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "UserProfileProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatNumber",
    ()=>formatNumber,
    "getCategoryColor",
    ()=>getCategoryColor,
    "getCategoryIcon",
    ()=>getCategoryIcon,
    "getGapTypeColor",
    ()=>getGapTypeColor,
    "getGapTypeLabel",
    ()=>getGapTypeLabel,
    "getProficiencyBgColor",
    ()=>getProficiencyBgColor,
    "getProficiencyColor",
    ()=>getProficiencyColor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}
function getProficiencyColor(proficiency) {
    if (proficiency >= 80) return 'text-emerald-400';
    if (proficiency >= 60) return 'text-amber-400';
    if (proficiency >= 40) return 'text-orange-400';
    return 'text-red-400';
}
function getProficiencyBgColor(proficiency) {
    if (proficiency >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
    if (proficiency >= 60) return 'bg-amber-500/20 border-amber-500/30';
    if (proficiency >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
}
function getGapTypeColor(gapType) {
    switch(gapType){
        case 'critical':
            return 'text-red-400 bg-red-500/10 border-red-500/20';
        case 'major':
            return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        case 'moderate':
            return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        case 'minor':
            return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        case 'strong':
            return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        default:
            return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
}
function getGapTypeLabel(gapType) {
    switch(gapType){
        case 'critical':
            return 'Critical Gap';
        case 'major':
            return 'Major Gap';
        case 'moderate':
            return 'Moderate Gap';
        case 'minor':
            return 'Minor Gap';
        case 'strong':
            return 'Strong';
        default:
            return 'Unknown';
    }
}
function getCategoryIcon(category) {
    const icons = {
        'Programming': 'code',
        'Data Structures & Algorithms': 'git-branch',
        'Machine Learning': 'brain',
        'Web Development': 'globe',
        'Git/GitHub': 'github',
        'Cloud': 'cloud',
        'Communication': 'message-square',
        'Problem Solving': 'puzzle',
        'AI': 'bot',
        'Development': 'code',
        'Career': 'briefcase',
        'Learning': 'book-open',
        'Industry': 'factory',
        'Trending': 'trending-up'
    };
    return icons[category] || 'circle';
}
function getCategoryColor(category) {
    const colors = {
        'Programming': 'blue',
        'Data Structures & Algorithms': 'purple',
        'Machine Learning': 'pink',
        'Web Development': 'cyan',
        'Git/GitHub': 'orange',
        'Cloud': 'indigo',
        'Communication': 'green',
        'Problem Solving': 'red',
        'AI': 'pink',
        'Development': 'blue',
        'Career': 'amber',
        'Learning': 'emerald',
        'Industry': 'slate',
        'Trending': 'rose'
    };
    return colors[category] || 'gray';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0d4395n._.js.map