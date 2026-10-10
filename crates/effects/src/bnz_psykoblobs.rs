use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BnzPsykoblobsProperties {
    pub speed: f32,
    pub density: f32,
}

impl Default for BnzPsykoblobsProperties {
    fn default() -> Self {
        Self {
            speed: 1.0,
            density: 42.0, 
        }
    }
}

pub fn register_effect() -> EffectDescriptor {
    EffectDescriptor {
        id: "bnz_psykoblobs".to_string(),
        display_name: "BNZ_Psykoblobs".to_string(),
        category: "Stylize / Generative".to_string(),
    }
}
