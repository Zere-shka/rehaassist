window.renderNutrition = function() {
    const container = document.createElement('div');
    container.className = 'nutrition-container';

    container.innerHTML = `
        <div class="card nutrition-header" style="background: linear-gradient(135deg, #dcfce7, #bbf7d0); border: 2px solid #22c55e;">
            <h2 style="color: #166534;"><i class="fas fa-apple-alt"></i> <span data-i18n="nutrition_title">${window.t('nutrition_title')}</span></h2>
            <p style="color: #14532d; font-weight: 500;" data-i18n="nutrition_subtitle">${window.t('nutrition_subtitle')}</p>
        </div>

        <!-- Section 1: Recovery after Stroke -->
        <div class="card">
            <h2 data-i18n="recovery_after_stroke">${window.t('recovery_after_stroke')}</h2>
            <div class="info-box" style="background: rgba(34, 197, 94, 0.1); padding: 15px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #22c55e;">
                <p><strong data-i18n="main_rule">${window.t('main_rule')}</strong> <span data-i18n="fractional_nutrition">${window.t('fractional_nutrition')}</span></p>
            </div>
            <div class="nutrition-grid">
                <div class="nutrition-item">
                    <i class="fas fa-blender"></i>
                    <div>
                        <strong data-i18n="food_texture">${window.t('food_texture')}</strong>
                        <p data-i18n="food_texture_desc">${window.t('food_texture_desc')}</p>
                    </div>
                </div>
                <div class="nutrition-item">
                    <i class="fas fa-egg"></i>
                    <div>
                        <strong data-i18n="protein_for_muscles">${window.t('protein_for_muscles')}</strong>
                        <p data-i18n="protein_for_muscles_desc">${window.t('protein_for_muscles_desc')}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Section 2: Prevention -->
        <div class="card">
            <h2 data-i18n="prevention_nutrition">${window.t('prevention_nutrition')}</h2>
            <p style="margin-bottom: 15px;" data-i18n="healthy_plate_principle">${window.t('healthy_plate_principle')}</p>
            <div class="prevention-plate">
                <div class="plate-item" style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;">
                    <strong data-i18n="plate_veg">${window.t('plate_veg')}</strong>
                    <p style="color: #15803d;" data-i18n="plate_veg_desc">${window.t('plate_veg_desc')}</p>
                </div>
                <div class="plate-item" style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af;">
                    <strong data-i18n="plate_grains">${window.t('plate_grains')}</strong>
                    <p style="color: #1d4ed8;" data-i18n="plate_grains_desc">${window.t('plate_grains_desc')}</p>
                </div>
                <div class="plate-item" style="background: #fff7ed; border: 1px solid #ffedd5; color: #9a3412;">
                    <strong data-i18n="plate_protein">${window.t('plate_protein')}</strong>
                    <p style="color: #c2410c;" data-i18n="plate_protein_desc">${window.t('plate_protein_desc')}</p>
                </div>
            </div>
        </div>

        <!-- Section 3: Hydration -->
        <div class="card">
            <h2 data-i18n="hydration_mode">${window.t('hydration_mode')}</h2>
            <div class="hydration-banner" style="display: flex; align-items: center; gap: 20px; background: #e0f2fe; padding: 20px; border-radius: 20px;">
                <i class="fas fa-tint" style="font-size: 40px; color: #0ea5e9;"></i>
                <div>
                    <h3 style="color: #0369a1; margin-bottom: 5px;" data-i18n="water_and_vessels">${window.t('water_and_vessels')}</h3>
                    <p style="color: #0c4a6e; font-size: 14px;" data-i18n="water_vessels_desc">${window.t('water_vessels_desc')}</p>
                </div>
            </div>
            <ul class="diet-list" style="margin-top: 20px;">
                <li data-i18n="hydration_rule_1">${window.t('hydration_rule_1')}</li>
                <li data-i18n="hydration_rule_2">${window.t('hydration_rule_2')}</li>
                <li data-i18n="hydration_rule_3">${window.t('hydration_rule_3')}</li>
                <li data-i18n="hydration_rule_4">${window.t('hydration_rule_4')}</li>
            </ul>
        </div>

        <!-- Section 4: Stop List -->
        <div class="card" style="border: 2px solid #fee2e2;">
            <h2 style="color: #991b1b;"><i class="fas fa-ban"></i> <span data-i18n="stop_list_title">${window.t('stop_list_title')}</span></h2>
            <div class="stop-list">
                <div class="stop-item"><span>🧂</span> <strong data-i18n="stop_salt">${window.t('stop_salt')}</strong> <span data-i18n="stop_salt_desc">${window.t('stop_salt_desc')}</span></div>
                <div class="stop-item"><span>🥓</span> <strong data-i18n="stop_meat">${window.t('stop_meat')}</strong> <span data-i18n="stop_meat_desc">${window.t('stop_meat_desc')}</span></div>
                <div class="stop-item"><span>🍩</span> <strong data-i18n="stop_trans">${window.t('stop_trans')}</strong> <span data-i18n="stop_trans_desc">${window.t('stop_trans_desc')}</span></div>
                <div class="stop-item"><span>🥫</span> <strong data-i18n="stop_fastfood">${window.t('stop_fastfood')}</strong></div>
            </div>
        </div>
    `;

    return container;
};
;
