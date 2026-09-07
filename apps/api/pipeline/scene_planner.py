"""
Advanced AI Scene Planner & AI Director (12-Step Architecture).

Decomposes raw user intent and marketing scripts into a production-grade
cinematic shot list, visual strategies, camera instructions, character/location
sheets, motion pacing, and generative prompts before any rendering begins.
"""
from typing import List, Dict, Any
from pipeline.types import (
    ScenePlanItem,
    FullScenePlan,
    MarketingScript,
    PipelineUserOptions,
    NodeStatus,
    NarrativeRole,
    StoryBeat,
    ShotPlanItem,
    CameraDirection,
    CharacterSheet,
    LocationSheet,
    MotionIntensity,
    AspectRatio,
)


class ScenePlanner:
    """
    The AI Director. Orchestrates the 12 core planning steps with
    caching and structured output scaling limits.
    """
    _scene_plan_cache: Dict[str, FullScenePlan] = {}

    @classmethod
    def get_cache_key(cls, prompt: str, style: str, duration: int) -> str:
        import hashlib
        return hashlib.md5(f"{prompt.strip().lower()}:{style}:{duration}".encode("utf-8")).hexdigest()

    # ── Step 1: Script Parsing (Extract Story Beats) ───────────────────────────
    @classmethod
    def extract_story_beats(cls, script: MarketingScript) -> List[StoryBeat]:
        return [
            StoryBeat(
                id=1,
                type="problem",
                narrative_role=NarrativeRole.HOOK,
                text=script.hook
            ),
            StoryBeat(
                id=2,
                type="agitation",
                narrative_role=NarrativeRole.PROBLEM,
                text=script.problem
            ),
            StoryBeat(
                id=3,
                type="product_intro_benefits",
                narrative_role=NarrativeRole.VALUE,
                text=script.solution
            ),
            StoryBeat(
                id=4,
                type="cta_conversion",
                narrative_role=NarrativeRole.CONVERSION,
                text=script.cta
            )
        ]

    # ── Step 2: Narrative Classification ──────────────────────────────────────
    @classmethod
    def get_narrative_mapping(cls) -> Dict[str, Dict[str, str]]:
        return {
            "HOOK": {
                "role": "Pattern Interrupt",
                "typical_visual": "Dramatic action, high movement, direct eye contact",
                "motion": "High Motion (Pacing: 85%)"
            },
            "PROBLEM": {
                "role": "Frustration & Agitation",
                "typical_visual": "Relatable user struggling with poor alternatives, cloudy shaker bottle",
                "motion": "Medium Motion (Pacing: 60%)"
            },
            "REVEAL": {
                "role": "Hero Product Reveal",
                "typical_visual": "Macro slow-motion liquid pour, condensation droplets, luxury packaging",
                "motion": "Smooth Cinematic Motion (Pacing: 50%)"
            },
            "VALUE": {
                "role": "Benefits & Payoff",
                "typical_visual": "Active product usage, muscle recovery, energetic satisfaction",
                "motion": "Medium Motion (Pacing: 55%)"
            },
            "TRUST": {
                "role": "Social Proof & Validation",
                "typical_visual": "Athlete endorsement, positive community reaction, badge proof",
                "motion": "Medium-Low Motion (Pacing: 45%)"
            },
            "CONVERSION": {
                "role": "Direct Urgency Call to Action",
                "typical_visual": "Branded offer screen, creator pointing down with discount badge",
                "motion": "Low Motion (Pacing: 25% for maximum copy clarity)"
            }
        }

    # ── Step 3: Duration Allocation ───────────────────────────────────────────
    @classmethod
    def allocate_durations(cls, total_duration: float) -> List[float]:
        # Hook: ~18% (short & punchy), Problem: ~22%, Value/Reveal: ~40% (longest), CTA: ~20%
        hook = round(total_duration * 0.18, 1)
        problem = round(total_duration * 0.22, 1)
        value = round(total_duration * 0.40, 1)
        cta = round(total_duration - (hook + problem + value), 1)
        return [hook, problem, value, cta]

    # ── Step 7: Character Consistency Sheet ───────────────────────────────────
    @classmethod
    def generate_character_sheet(cls, raw_prompt: str, options: PipelineUserOptions) -> CharacterSheet:
        prompt_lower = raw_prompt.lower()
        if "protein" in prompt_lower or "fitness" in prompt_lower or "workout" in prompt_lower:
            return CharacterSheet(
                character_id="athlete_01",
                name="Maya Lin",
                gender="female",
                hair="brunette hair in high athletic ponytail",
                age="26-year-old",
                clothing="matte black seamless gym apparel with charcoal accents",
                facial_features="glowing healthy skin, determined athletic expression, subtle perspiration sheen",
                consistency_token="[VMAX_CHAR_ATHLETE_MAYA]"
            )
        else:
            return CharacterSheet(
                character_id="creator_01",
                name="Alex Rivers",
                gender="neutral",
                hair="neat textured brown hair",
                age="28-year-old",
                clothing="minimalist oversized black crewneck and smart watch",
                facial_features="engaging friendly eyes, confident direct address",
                consistency_token="[VMAX_CHAR_CREATOR_ALEX]"
            )

    # ── Step 8: Location Consistency Sheet ────────────────────────────────────
    @classmethod
    def generate_location_sheet(cls, raw_prompt: str, options: PipelineUserOptions) -> LocationSheet:
        prompt_lower = raw_prompt.lower()
        if "protein" in prompt_lower or "fitness" in prompt_lower or "workout" in prompt_lower:
            return LocationSheet(
                location_id="loc_modern_gym",
                name="Equinox-Style Boutique Fitness Studio",
                environment="Spacious high-end private gym with polished concrete floors, matte black dumbbell racks, and floor-to-ceiling glass windows",
                lighting="Bright natural morning sunlight mixed with dramatic volumetric rim backlighting",
                color_palette="Matte dark slate, warm cedar accents, clean architectural ambient glow",
                atmosphere="Energetic, aspirational, impeccably clean luxury athletic space"
            )
        else:
            return LocationSheet(
                location_id="loc_modern_loft",
                name="Architectural Creator Loft Studio",
                environment="Contemporary sunlit loft with concrete walls, minimalist shelving, and indoor greenery",
                lighting="Soft diffused studio softbox lighting with golden hour window spill",
                color_palette="Warm beige, Scandinavian white, charcoal accents",
                atmosphere="High-end productivity and modern lifestyle aesthetic"
            )

    # ── Step 5 & 6: Shot Planning & Camera Planning ───────────────────────────
    @classmethod
    def plan_shots_for_scene(
        cls,
        scene_index: int,
        duration: float,
        character: CharacterSheet,
        location: LocationSheet,
        role: NarrativeRole
    ) -> List[ShotPlanItem]:
        if role == NarrativeRole.HOOK:
            return [
                ShotPlanItem(
                    shot_number=1,
                    shot_type="medium_closeup",
                    duration=round(duration * 0.55, 1),
                    visual_action=f"{character.name} ({character.hair}, {character.clothing}) drops heavy dumbbells on rubber gym floor, exhales, and immediately looks up into camera lens with high energy.",
                    camera=CameraDirection(
                        camera_type="Handheld UGC",
                        movement="Fast snappy punch-in zoom with slight authentic handheld tremor",
                        lens="28mm wide-angle",
                        angle="Eye-level, dynamic tilt"
                    )
                ),
                ShotPlanItem(
                    shot_number=2,
                    shot_type="extreme_closeup",
                    duration=round(duration * 0.45, 1),
                    visual_action=f"Dramatic direct eye contact, {character.name} breathing heavily with authentic workout intensity.",
                    camera=CameraDirection(
                        camera_type="Optical Gimbal",
                        movement="Slow steady push-in locking focus on eyes",
                        lens="50mm portrait lens",
                        angle="Eye-level tack-sharp focal depth"
                    )
                )
            ]
        elif role == NarrativeRole.PROBLEM:
            return [
                ShotPlanItem(
                    shot_number=1,
                    shot_type="medium_shot",
                    duration=round(duration * 0.6, 1),
                    visual_action=f"{character.name} vigorously shaking a cheap cloudy plastic shaker bottle, pausing to inspect gross unmixed clumps stuck to the transparent walls.",
                    camera=CameraDirection(
                        camera_type="Dolly Track",
                        movement="Slow pull-back revealing frustrated expression",
                        lens="35mm documentary lens",
                        angle="Chest-height neutral"
                    )
                ),
                ShotPlanItem(
                    shot_number=2,
                    shot_type="macro",
                    duration=round(duration * 0.4, 1),
                    visual_action="Macro focus on chalky, gummy powder residue clinging inside a cloudy shaker cup.",
                    camera=CameraDirection(
                        camera_type="Static Macro",
                        movement="Locked-off macro focus with shallow depth of field",
                        lens="85mm f/2.8 Macro",
                        angle="Side profile with backlight revealing powder clumps"
                    )
                )
            ]
        elif role == NarrativeRole.VALUE:
            return [
                ShotPlanItem(
                    shot_number=1,
                    shot_type="hero_reveal_wide",
                    duration=round(duration * 0.35, 1),
                    visual_action="Sleek matte-black branded protein bottle standing proud on gym bench, illuminated by dramatic volumetric light shafts.",
                    camera=CameraDirection(
                        camera_type="Motorized Slider",
                        movement="Low-angle lateral tracking glide",
                        lens="50mm prime",
                        angle="Slight low-angle hero perspective"
                    )
                ),
                ShotPlanItem(
                    shot_number=2,
                    shot_type="macro_liquid_pour",
                    duration=round(duration * 0.40, 1),
                    visual_action="Ultra slow-motion 120fps pour of velvety rich chocolate protein shake into glass, creamy vortex swirl with zero lumps.",
                    camera=CameraDirection(
                        camera_type="High-Speed Phantom",
                        movement="180-degree orbital sweep matching liquid flow",
                        lens="100mm Macro lens",
                        angle="45-degree downward angle"
                    )
                ),
                ShotPlanItem(
                    shot_number=3,
                    shot_type="satisfaction_close",
                    duration=round(duration * 0.25, 1),
                    visual_action=f"{character.name} taking a refreshing sip, closing eyes with a genuine satisfied smile.",
                    camera=CameraDirection(
                        camera_type="Handheld Steady",
                        movement="Subtle slow push-in capturing natural smile",
                        lens="50mm f/1.8",
                        angle="Eye-level warm golden rim light"
                    )
                )
            ]
        else: # CONVERSION / CTA
            return [
                ShotPlanItem(
                    shot_number=1,
                    shot_type="medium_centered",
                    duration=round(duration * 0.5, 1),
                    visual_action=f"{character.name} smiling warmly, holding product tub in left hand and pointing index finger directly downward toward the link button.",
                    camera=CameraDirection(
                        camera_type="Tripod Centered",
                        movement="Steady locked frame with quick 1.1x digital punch-in for urgency",
                        lens="35mm lens",
                        angle="Direct eye-level commercial framing"
                    )
                ),
                ShotPlanItem(
                    shot_number=2,
                    shot_type="end_card_brand",
                    duration=round(duration * 0.5, 1),
                    visual_action="Hero 3D product render with glowing discount callout '25% OFF STARTER BUNDLE' and animated swipe-up indicator.",
                    camera=CameraDirection(
                        camera_type="Motion Graphics Compositing",
                        movement="Gentle floating slow push",
                        lens="Virtual 50mm",
                        angle="Straight-on centered"
                    )
                )
            ]

    # ── Master Planning Engine ────────────────────────────────────────────────
    @classmethod
    async def plan_comprehensive(
        cls,
        raw_prompt: str,
        script: MarketingScript,
        options: PipelineUserOptions
    ) -> FullScenePlan:
        # Check scene plan cache
        cache_key = cls.get_cache_key(raw_prompt, options.style.value, options.duration)
        if cache_key in cls._scene_plan_cache:
            return cls._scene_plan_cache[cache_key]

        # Step 1 & 2: Story beats & narrative classification
        story_beats = cls.extract_story_beats(script)
        narrative_map = cls.get_narrative_mapping()

        # Step 3: Duration allocation
        durations = cls.allocate_durations(options.duration)

        # Step 7 & 8: Character and location consistency sheets
        character = cls.generate_character_sheet(raw_prompt, options)
        location = cls.generate_location_sheet(raw_prompt, options)

        # Build each scene with steps 4, 5, 6, 9, 10
        scenes: List[ScenePlanItem] = []
        current_time = 0.0

        scene_configs = [
            (
                1,
                "Pattern Interrupt Hook",
                NarrativeRole.HOOK,
                script.hook,
                [
                    "Exhausted athletic creator dropping dumbbells",
                    "Breathing hard with direct eye contact",
                    "Authentic handheld smartphone shake",
                    "Volumetric morning gym sunlight"
                ],
                MotionIntensity(level="high motion", intensity_score=85, pacing_rationale="Fast pattern interrupt to stop social feed scrolling within 1.5s")
            ),
            (
                2,
                "Problem & Frustration Agitation",
                NarrativeRole.PROBLEM,
                script.problem,
                [
                    "Creator shaking cheap cloudy plastic shaker bottle",
                    "Macro view of gross white unmixed powder clumps",
                    "Disgusted, dissatisfied reaction",
                    "Relatable everyday fitness dilemma"
                ],
                MotionIntensity(level="medium motion", intensity_score=60, pacing_rationale="Clear demonstration of common customer frustration")
            ),
            (
                3,
                "Hero Reveal & Solution Payoff",
                NarrativeRole.VALUE,
                script.solution,
                [
                    "Hero product reveal on bench",
                    "Macro slow-motion liquid pour at 120fps",
                    "Rich creamy velvety texture with zero clumps",
                    "Satisfied tasting reaction with genuine smile"
                ],
                MotionIntensity(level="smooth cinematic", intensity_score=55, pacing_rationale="Aspirational sensory proof showing texture and immediate benefit")
            ),
            (
                4,
                "High-Urgency Call to Action",
                NarrativeRole.CONVERSION,
                script.cta,
                [
                    "Creator holding product tub with confident smile",
                    "Pointing downward to CTA link banner",
                    "Limited-time discount badge overlay",
                    "Clean studio backdrop with high logo legibility"
                ],
                MotionIntensity(level="low motion", intensity_score=25, pacing_rationale="Low visual distraction for maximum CTA conversion clarity")
            ),
        ]

        sample_images = [
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop",
        ]
        sample_videos = [
            "http://localhost:8000/local-media/sample/ForBiggerBlazes.mp4",
            "http://localhost:8000/local-media/sample/ForBiggerEscapes.mp4",
            "http://localhost:8000/local-media/sample/ForBiggerFun.mp4",
            "http://localhost:8000/local-media/sample/ForBiggerJoyBlazes.mp4",
        ]

        aspect_flag = "Vertical 9:16 framing" if options.aspect_ratio == AspectRatio.RATIO_9_16 else f"{options.aspect_ratio.value} framing"

        for idx, (s_num, s_title, role, copy, strat, motion) in enumerate(scene_configs):
            dur = durations[idx]
            start_t = round(current_time, 1)
            end_t = round(start_t + dur, 1)
            current_time = end_t

            # Step 5 & 6: Plan discrete shots and cameras
            shots = cls.plan_shots_for_scene(s_num, dur, character, location, role)

            # Step 10: Prompt Construction (Visual generative language)
            gen_prompt = (
                f"{s_title}: {character.consistency_token} {character.name} ({character.gender}, {character.hair}, {character.clothing}) "
                f"in {location.environment}. Visual action: {strat[0]}, {strat[1]}. "
                f"Camera: {shots[0].camera.movement}, {shots[0].camera.lens}, {shots[0].camera.angle}. "
                f"Lighting: {location.lighting}. Pacing: {motion.level}. "
                f"{aspect_flag}, photorealistic 4K cinematic render, volumetric depth, zero artifacts."
            )

            scenes.append(
                ScenePlanItem(
                    scene_number=s_num,
                    title=s_title,
                    narrative_role=role,
                    start_time=start_t,
                    end_time=end_t,
                    duration=dur,
                    script_segment=copy,
                    visual_strategy=strat,
                    shots=shots,
                    camera=shots[0].camera,
                    character_ref=character.character_id,
                    location_ref=location.location_id,
                    motion_intensity=motion,
                    visual_prompt=gen_prompt,
                    camera_movement=shots[0].camera.movement,
                    image_url=sample_images[idx % len(sample_images)],
                    video_url=sample_videos[idx % len(sample_videos)],
                    status=NodeStatus.COMPLETED
                )
            )

        # Step 11: Asset Dependency Graph
        asset_dag = {
            "root_nodes": ["prompt_engineer", "script_writer", "scene_planner"],
            "parallel_generation_branches": {
                "branch_visuals": ["scene_1_worker", "scene_2_worker", "scene_3_worker", "scene_4_worker"],
                "branch_audio": ["elevenlabs_voiceover", "music_selection_ducking"],
                "branch_captions": ["whisper_word_timestamps", "hormozi_styler"]
            },
            "convergence_node": "ffmpeg_hardware_render_farm",
            "post_render_nodes": ["quality_checker", "s3_persister", "cloudfront_cdn"]
        }

        plan_result = FullScenePlan(
            title="UltraShake 30s High-Converting UGC Social Ad",
            total_duration=float(options.duration),
            character_sheet=character,
            location_sheet=location,
            story_beats=story_beats,
            scenes=scenes,
            asset_dag=asset_dag
        )
        cls._scene_plan_cache[cache_key] = plan_result
        return plan_result

    # Legacy helper for orchestrator backward compatibility
    @classmethod
    async def plan(cls, script: MarketingScript, enhanced_prompt: str, options: PipelineUserOptions) -> List[ScenePlanItem]:
        full_plan = await cls.plan_comprehensive(enhanced_prompt, script, options)
        return full_plan.scenes
