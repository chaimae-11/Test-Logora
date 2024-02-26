# spec/models/concerns/moderable_spec.rb
require 'rails_helper'

RSpec.describe Moderable do
  let(:reponse_moquee) { { 'accepted' => true } }

  before do
    allow(HTTParty).to receive(:post).and_return(double(body: reponse_moquee.to_json, code: 200))
  end

  describe '#moderer_contenu' do
    context 'contenu est modéré avec succès' do
      it 'changer is_accepted en true' do
        modele_moderé = ModeratedModel.create(colonne1: 'contenu_modérable')
        expect(modele_moderé.is_accepted).to eq(true)
      end
    end

    context 'la modération échoue' do
      it 'ne pas changer is_accepted' do
        allow(HTTParty).to receive(:post).and_raise(HTTParty::Error)
        modele_moderé = ModeratedModel.create(colonne1: 'contenu_modérable')
        expect(modele_moderé.is_accepted).to be_nil
      end
    end
  end
end
