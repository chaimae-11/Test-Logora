# app/models/concerns/moderable.rb
require 'httparty'

module Moderable
  extend ActiveSupport::Concern

  included do
    after_save :moderer_contenu
  end

  private

  def moderer_contenu
    colonnes_a_moderer.each do |colonne|
      contenu = send(colonne)
      next if contenu.blank?

      reponse = envoyer_requete_de_moderation(contenu)
      update(is_accepted: reponse['accepted']) if reponse.present?
    end
  end

  def envoyer_requete_de_moderation(contenu)
    reponse = HTTParty.post(
      'https://moderation.logora.fr/predict',
      body: { text: contenu }.to_json,
      headers: { 'Content-Type' => '/apispec_1.json' }
    )

    JSON.parse(reponse.body) if reponse.code == 200
  rescue HTTParty::Error => e
    Rails.logger.error("Erreur HTTParty: #{e.message}")
  rescue StandardError => e
    Rails.logger.error("Erreur: #{e.message}")
  end

  def colonnes_a_moderer
    [:colonne1, :colonne2] # colonne1 et colonne2 sont les noms des colonnes à modérer
  end
end
